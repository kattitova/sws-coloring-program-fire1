program sendmail;

{

  fake sendmail for windows

  Copyright (c) 2004-2009, Byron Jones, sendmail@glob.com.au
  All rights reserved.

  requires indy 10

  version 26
    - no longer require -t parameter
    - skip first line if it starts with "from " (mail spool delimiting line)

  version 25
    - added force_recipient

  version 24
    - fixes for ssl

  version 23
    - fix timezone in date header

  version 22
    - fixes to error handling

  version 21
    - add TLS support

  version 20
    - fixed race condition in IIS's pickup delivery

  version 19
    - added support for delivery via IIS's pickup directory
    - optionally reads settings from the registry (in absense of the ini file)

  version 18
    - fix for indy 10 "range check error" (see below)

  version 17
    - only process message header
    - optionally use madexcept for detailed crash dumps
    - added smtp_port setting

  version 16
    - send hostname and domain with HELO/EHLO
    - configurable HELO/EHLO hostname
    - upgraded to indy 10

  version 15
    - fixes error messages when debug_logfile is not specified

  version 14
    - errors output to STDERR
    - fixes for delphi 7 compilation
    - added 'connecting to..' debug logging
    - reworked error and debug log format

  version 13
    - added fix to work around invalid multiple header instances

  version 12
    - added cc and bcc support

  version 11
    - added pop3 support (for pop before smtp authentication)

  version 10
    - added support for specifying a different smtp port

  version 9
    - added force_sender

  version 8
    - *really* fixes broken smtp auth

  version 7
    - fixes broken smtp auth

  version 6
    - correctly quotes MAIL FROM and RCPT TO addresses in <>

  version 5
    - now sends the message unchanged (rather than getting indy
      to regenerate it)

  version 4
    - added debug_logfile parameter
    - improved error messages

  version 3
    - smtp authentication support
    - clearer error message when missing from or to address
    - optional error logging
    - adds date header if missing

  version 2
    - reads default domain from registry (.ini setting overrides)

  version 1
    - initial release

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions
  are met:

    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.

    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.

    * Neither the name of the glob nor the names of its contributors may
      be used to endorse or promote products derived from this software
      without specific prior written permission.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
  "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
  LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
  A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
  OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
  SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
  DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
  THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
  OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.


  INDY 10.0.52 "range check error" fix

  --- System.original/IdGlobal.pas        2006-04-28 10:23:48.000000000 +0800
  +++ System/IdGlobal.pas 2006-05-01 10:03:52.640519100 +0800
  @@ -1377,7 +1377,7 @@
   begin
     if Windows.QueryPerformanceFrequency(freq) then begin
       if Windows.QueryPerformanceCounter(nTime) then begin
  -      Result := Trunc((nTime / Freq) * 1000);
  +      Result := Trunc((nTime / Freq) * 1000) and High(Cardinal);
       end else begin
         Result := Windows.GetTickCount;
       end;

}

{$APPTYPE CONSOLE}

{$I IdCompilerDefines.inc}
{$IFNDEF INDY100}indy version 10 is required{$ENDIF}

{$DEFINE USE_MADEXCEPT}

uses
  Windows, Classes, SysUtils, Registry, IniFiles,
  IdGlobal, IdResourceStringsCore, IdGlobalProtocols, IdResourceStrings, IdExplicitTLSClientServerBase,           
  IDSmtp, IDPOP3, IdMessage, IdEmailAddress, IdLogFile, IdWinSock2, IdIOHandler, IdSys, IdSSLOpenSSL, IdException, IdSysWin32
  {$IFDEF USE_MADEXCEPT}
  , madExcept, madLinkDisAsm, madListHardware, madListProcesses, madListModules
  {$ENDIF}
  ;

// ---------------------------------------------------------------------------

function buildLogLine(data, prefix: string) : string;
// ensure the output of error and debug logs are in the same format, regardless of source
begin

  data := StringReplace(data, EOL, RSLogEOL, [rfReplaceAll]);
  data := StringReplace(data, CR, RSLogCR, [rfReplaceAll]);
  data := StringReplace(data, LF, RSLogLF, [rfReplaceAll]);

  result := FormatDateTime('yy/mm/dd hh:nn:ss', now) + ' ';
  if (prefix <> '') then
    result := result + prefix + ' ';
  result := result + data + EOL;
end;

// ---------------------------------------------------------------------------

type

  // TidLogFile using buildLogLine function

  TlogFile = class(TidLogFile)
  protected
    procedure LogReceivedData(AText: string; AData: string); override;
    procedure LogSentData(AText: string; AData: string); override;
    procedure LogStatus(AText: string); override;
  public
    procedure LogWriteString(AText: string); override;
  end;

// ---------------------------------------------------------------------------

procedure TlogFile.LogReceivedData(AText: string; AData: string);
begin
  // ignore AText as it contains the date/time
  LogWriteString(buildLogLine(Adata, '<<'));
end;

// ---------------------------------------------------------------------------

procedure TlogFile.LogSentData(AText: string; AData: string);
begin
  // ignore AText as it contains the date/time
  LogWriteString(buildLogLine(Adata, '>>'));
end;

// ---------------------------------------------------------------------------

procedure TlogFile.LogStatus(AText: string);
begin
  LogWriteString(buildLogLine(AText, '**'));
end;

// ---------------------------------------------------------------------------

procedure TlogFile.LogWriteString(AText: string);
begin
  // protected --> public
  inherited;
end;

// ---------------------------------------------------------------------------

var
  errorLogFile: string;
  debugLogFile: string;
  debug       : TlogFile;

// ---------------------------------------------------------------------------

procedure writeToLog(const logFilename, logMessage: string; const prefix: string = '');
var
  f: TextFile;
begin
  AssignFile(f, logFilename);
  try

    if (not FileExists(logFilename)) then
    begin
      ForceDirectories(ExtractFilePath(logFilename));
      Rewrite(f);
    end
    else
      Append(f);

    write(f, buildLogLine(logMessage, prefix));
    closeFile(f);

  except
    on e:Exception do
      writeln(ErrOutput, 'sendmail: Error writing to ' + logFilename + ': ' + logMessage);
  end;
end;

// ---------------------------------------------------------------------------

procedure debugLog(const logMessage: string);
begin
  if (debug <> nil) and (debug.Active) then
    debug.LogWriteString(buildLogLine(logMessage, '**'))
  else if (debugLogFile <> '') then
    writeToLog(debugLogFile, logMessage, '**');
end;

// ---------------------------------------------------------------------------

procedure errorLog(const logMessage: string);
begin
  if (errorLogFile <> '') then
    writeToLog(errorLogFile, logMessage, ':');
  debugLog(logMessage);
end;

// ---------------------------------------------------------------------------

function appendDomain(const address, domain: string): string;
begin
  Result := address;
  if (Pos('@', address) <> 0) then
    Exit;
  Result := Result + '@' + domain;
end;

// ---------------------------------------------------------------------------

function joinMultiple(const messageContent: string; fieldName: string): string;
// the rfc says that some fields are only allowed once in a message header
// for example, to, from, subject
// this function joins multiple instances of the specified field into a single comma seperated line
var
  sl    : TstringList;
  i     : integer;
  s     : string;
  n     : integer;
  count : integer;
  values: TstringList;
begin

  fieldName := LowerCase(fieldName);
  sl := TStringList.Create;
  values := TStringList.Create;
  try

    sl.text := messageContent;
    result := '';

    // only modify the header if there's more than one instance of the field

    count := 0;
    for i := 0 to sl.count - 1 do
    begin
      s := sl[i];
      if (s = '') then
        break;
      n := pos(':', s);
      if (n = 0) then
        break;
      if (lowerCase(copy(s, 1, n - 1)) = fieldName) then
        inc(count);
    end;

    if (count <= 1) then
    begin
      result := messageContent;
      exit;
    end;

    // more than on instance of the field, combine into single entry, ignore fields with empty values

    while (sl.count > 0) do
    begin
      s := sl[0];
      if (s = '') then
        break;
      n := pos(':', s);
      if (n = 0) then
        break;

      if (lowerCase(copy(s, 1, n - 1)) = fieldName) then
      begin
        s := trim(copy(s, n + 1, length(s)));
        if (s <> '') then
          values.Add(s);
      end
      else
        result := result + s + #13#10;

      sl.Delete(0);
    end;

    if (values.count <> 0) then
    begin
      s := UpCaseFirst(fieldName) + ': ';
      for i := 0 to values.count - 1 do
        s := s + values[i] + ', ';
      setLength(s, length(s) - 2);
      result := result + s + #13#10;
    end;

    result := result + sl.Text;

  finally
    values.Free;
    sl.free;
  end;

end;

// ---------------------------------------------------------------------------

function DateTimeToInternetStr(const Value: TIdDateTimeBase): string;
var
  day  : word;
  month: word;
  year : word;
begin
  DecodeDate(Value, year, month, day);
  Result := Format(
    '%s, %d %s %d %s %s',
    [
      wdays[DayOfWeek(Value)],
      day,
      monthnames[month],
      year,
      FormatDateTime('HH":"mm":"ss', Value),
      Sys.DateTimeToGmtOffSetStr(TIdSysWin32.OffsetFromUTC, false)
    ]
  );
end;

// ---------------------------------------------------------------------------

{$IFDEF USE_MADEXCEPT}
procedure madExceptionHandler(const exceptIntf: IMEException; var handled: boolean);
var
  path: string;
  i   : integer;
  fs  : TFileStream;
  s   : string;
begin
  handled := true;

  path := extractFilePath(debugLogFile);

  deleteFile(path + 'crash-5.txt');
  for i := 4 downto 1 do
  if (fileExists(path + 'crash-' + intToStr(i) + '.txt')) then
    RenameFile(path + 'crash-'+ intToStr(i) + '.txt', path + 'crash-' + intToStr(i + 1) + '.txt');
  if (fileExists(path + 'crash.txt')) then
    RenameFile(path + 'crash.txt', path + 'crash-1.txt');

  fs := TFileStream.Create(path + 'crash.txt', fmCreate);
  try
    s := exceptIntf.GetBugReport;
    fs.Write(s[1], length(s));
  finally
    fs.free;
  end;

  halt(1);
end;
{$ENDIF}

// ---------------------------------------------------------------------------

var

  smtpServer    : string;
  smtpPort      : string;
  smtpSSL       : (ssAuto, ssSSL, ssTLS, ssNone);
  defaultDomain : string;
  messageContent: string;
  authUsername  : string;
  authPassword  : string;
  forceSender   : string;
  forceRcpt     : string;
  pop3server    : string;
  pop3username  : string;
  pop3password  : string;
  hostname      : string;
  isPickup      : boolean;

  reg : TRegistry;
  ini : TCustomIniFile;
  pop3: TIdPop3;
  smtp: TIdSmtp;

  i     : integer;
  s     : string;
  ss    : TStringStream;
  msg   : TIdMessage;
  sl    : TStringList;
  header: boolean;
  fs    : TFileStream;

begin

  // read default domain from registry

  reg := TRegistry.Create;
  try
    reg.RootKey := HKEY_LOCAL_MACHINE;
    if (reg.OpenKeyReadOnly('\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters')) then
      defaultDomain := reg.ReadString('Domain');
  finally
    reg.Free;
  end;

  // read ini

  s := ChangeFileExt(ParamStr(0), '.ini');
  if (FileExists(s)) then
    ini := TIniFile.Create(s)
  else
  begin
    ini := TRegistryIniFile.Create('\software');
    TRegistryIniFile(ini).RegIniFile.RootKey := HKEY_LOCAL_MACHINE;
    TRegistryIniFile(ini).RegIniFile.OpenKey(TRegistryIniFile(ini).FileName, true);
  end;

  try

    smtpServer    := ini.ReadString('sendmail', 'smtp_server',     'mail.mydomain.com');
    smtpPort      := ini.ReadString('sendmail', 'smtp_port',       '25');
    defaultDomain := ini.ReadString('sendmail', 'default_domain',  defaultDomain);
    hostname      := ini.ReadString('sendmail', 'hostname',        '');
    errorLogFile  := ini.ReadString('sendmail', 'error_logfile',   '');
    debugLogFile  := ini.ReadString('sendmail', 'debug_logfile',   '');
    authUsername  := ini.ReadString('sendmail', 'auth_username',   '');
    authPassword  := ini.ReadString('sendmail', 'auth_password',   '');
    forceSender   := ini.ReadString('sendmail', 'force_sender',    '');
    forceRcpt     := ini.ReadString('sendmail', 'force_recipient', '');
    pop3server    := ini.ReadString('sendmail', 'pop3_server',     '');
    pop3username  := ini.ReadString('sendmail', 'pop3_username',   '');
    pop3password  := ini.ReadString('sendmail', 'pop3_password',   '');

    s := LowerCase(ini.ReadString('sendmail', 'smtp_ssl', 'auto'));
    if (s = 'ssl') then
      smtpSSL := ssSSL
    else if (s = 'tls') then
      smtpSSL := ssTLS
    else if (s = 'none') then
      smtpSSL := ssNone
    else
      smtpSSL := ssAuto;

    if (smtpServer = 'mail.mydomain.com') or (defaultDomain = 'mydomain.com') then
    begin
      writeln(ErrOutput, 'You must configure the smtp_server and default_domain in:');
      writeln(ErrOutput, '  ' + ini.fileName);
      writeln(ErrOutput, '  or');
      writeln(ErrOutput, '  HKLM\Software\Sendmail');
      halt(1);
    end;

  finally
    ini.Free;
  end;

  if (errorLogFile <> '') and (ExtractFilePath(errorLogFile) = '') then
    errorLogFile := ExtractFilePath(ParamStr(0)) + errorLogFile;

  if (debugLogFile <> '') and (ExtractFilePath(debugLogFile) = '') then
    debugLogFile := ExtractFilePath(ParamStr(0)) + debugLogFile;

  isPickup := DirectoryExists(smtpServer);
  if (isPickup) then
    smtpServer := IncludeTrailingPathDelimiter(smtpServer);

  // read email from stdin

  messageContent := '';
  while (not eof(Input)) do
  begin
    readln(Input, s);
    if (messageContent = '') and (copy(s, 1, 5) = 'From ') then
      continue;
    messageContent := messageContent + s + #13#10;
  end;

  // make sure message is CRLF delimited

  if (pos(#10, messageContent) = 0) then
    messageContent := stringReplace(messageContent, #13, #13#10, [rfReplaceAll]);

  if (debugLogFile <> '') then
  begin
    debugLog('--- MESSAGE BEGIN ---');
    sl := TStringList.Create;
    try
      sl.Text := messageContent;
      for i := 0 to sl.Count - 1 do
        debugLog(sl[i]);
    finally
      sl.Free;
    end;
    debugLog('--- MESSAGE END ---');
  end;

  // fix multiple to, cc, bcc and subject fields

  messageContent := joinMultiple(messageContent, 'to');
  messageContent := joinMultiple(messageContent, 'cc');
  messageContent := joinMultiple(messageContent, 'bcc');
  messageContent := joinMultiple(messageContent, 'subject');

  // deliver message

  {$IFDEF USE_MADEXCEPT}
  RegisterExceptionHandler(madExceptionHandler, stTrySyncCallAlways);
  {$ENDIF}

  try

    if (isPickup) then
    begin

      // drop to IIS's pickup directory

      ForceDirectories(smtpServer + 'Temp');

      // generate filename (in the temp directory)

      setLength(s, MAX_PATH);
      if (GetTempFileName(pChar(smtpServer + 'Temp'), 'sm', 0, @s[1]) = 0) then
        RaiseLastOSError;
      s := strPas(pChar(s));

      // write

      fs := TFileStream.Create(s, fmCreate);
      try
        fs.Write(messageContent[1], length(messageContent));
      finally
        fs.free;
      end;

      // move into the real pickup directory

      if (not RenameFile(s, smtpServer + ChangeFileExt(ExtractFileName(s), '.eml'))) then
        RaiseLastOSError;

      RemoveDir(smtpServer + 'Temp');

    end
    else
    begin

      // deliver via smtp

      // load message into stream

      ss  := TStringStream.Create(messageContent);
      msg := nil;

      try

        // load message

        msg := TIdMessage.Create(nil);
        try
          msg.LoadFromStream(ss, true);
        except
          on e:exception do
            raise exception.create('Failed to read email message: ' + e.message);
        end;

        // check for from and to

        if (forceSender = '') and (Msg.From.Address = '') then
          raise Exception.Create('Message is missing sender''s address');
        if (forceRcpt = '') and (Msg.Recipients.Count = 0) and (Msg.CCList.Count = 0) and (Msg.BccList.Count = 0) then
          raise Exception.Create('Message is missing recipient''s address');

        if (debugLogFile <> '') then
        begin
          debug          := TlogFile.Create(nil);
          debug.FileName := debugLogFile;
          debug.Active   := True;
        end
        else
          debug := nil;

        if ((pop3server <> '') and (pop3username <> '')) then
        begin

          // pop3 before smtp auth

          debugLog('Authenticating with POP3 server');

          pop3 := TIdPOP3.Create(nil);
          try
            if (debug <> nil) then
            begin
              pop3.IOHandler           := TIdIOHandler.MakeDefaultIOHandler(pop3);
              pop3.IOHandler.Intercept := debug;
              pop3.IOHandler.OnStatus  := pop3.OnStatus;
              pop3.ManagedIOHandler    := True;
            end;
            pop3.Host           := pop3server;
            pop3.Username       := pop3username;
            pop3.Password       := pop3password;
            pop3.ConnectTimeout := 10 * 1000;
            pop3.Connect;
            pop3.Disconnect;
          finally
            pop3.free;
          end;

        end;

        smtp := TIdSMTP.Create(nil);
        try

          // if openSSL libraries are available, use SSL for TLS support

          smtp.IOHandler := nil;
          smtp.ManagedIOHandler := True;

          if (smtpSSL <> ssNone) then
          begin
            try
              TIdSSLContext.Create.Free;
              smtp.IOHandler := TIdSSLIOHandlerSocketOpenSSL.Create(smtp);

              if (smtpSSL = ssAuto) then
                if (strToIntDef(smtpPort, 25) = 465) then
                  smtpSSL := ssSSL
                else
                  smtpSSL := ssTLS;

              if (smtpSSL = ssSSL) then
                smtp.UseTLS := utUseImplicitTLS
              else
                smtp.UseTLS := utUseExplicitTLS;
            except
              smtp.IOHandler := nil;
            end;
          end;

          if (smtp.IOHandler = nil) then
          begin
            smtp.IOHandler := TIdIOHandler.MakeDefaultIOHandler(smtp);
            smtp.UseTLS := utNoTLSSupport;
          end;

          if (debug <> nil) then
          begin
            smtp.IOHandler.Intercept := debug;
            smtp.IOHandler.OnStatus  := smtp.OnStatus;
          end;

          // set host, port

          i := pos(':', smtpServer);
          if (i = 0) then
          begin
            smtp.host := smtpServer;
            smtp.port := strToIntDef(smtpPort, 25);
          end
          else
          begin
            smtp.host := copy(smtpServer, 1, i - 1);
            smtp.port := strToIntDef(copy(smtpServer, i + 1, length(smtpServer)), 25);
          end;

          // set hostname (for helo/ehlo)

          if (hostname = '') then
          begin
            setLength(hostname, 255);
            GetHostName(pChar(hostname), length(hostname));
            hostname := string(pChar(hostname));
            if (pos('.', hostname) = 0) and (defaultDomain <> '') then
              hostname := hostname + '.' + defaultDomain;
          end;
          smtp.HeloName := hostname;

          // connect to server

          debugLog('Connecting to ' + smtp.Host + ':' + intToStr(smtp.Port));

          smtp.ConnectTimeout := 10 * 1000;
          smtp.Connect;

          // set up authentication

          if (authUsername <> '') then
          begin
            debugLog('Authenticating as ' + authUsername);
            smtp.AuthType := atDefault;
            smtp.Username := authUsername;
            smtp.Password := authPassword;
          end;

          // authenticate and start tls

          smtp.Authenticate;

          // sender and recipients

          if (forceSender = '') then
            smtp.SendCmd('MAIL FROM: <' + appendDomain(Msg.From.Address, defaultDomain) + '>', [250])
          else
            smtp.SendCmd('MAIL FROM: <' + appendDomain(forceSender, defaultDomain) + '>', [250]);

          if (forceRcpt = '') then
          begin
            for i := 0 to msg.Recipients.Count - 1 do
              smtp.SendCmd('RCPT TO: <' + appendDomain(Msg.Recipients[i].Address, defaultDomain) + '>', [250]);

            for i := 0 to msg.ccList.Count - 1 do
              smtp.SendCmd('RCPT TO: <' + appendDomain(Msg.ccList[i].Address, defaultDomain) + '>', [250]);

            for i := 0 to msg.BccList.Count - 1 do
              smtp.SendCmd('RCPT TO: <' + appendDomain(Msg.BccList[i].Address, defaultDomain) + '>', [250]);
          end
          else
            smtp.SendCmd('RCPT TO: <' + appendDomain(forceRcpt, defaultDomain) + '>', [250]);

          // start message content

          smtp.SendCmd('DATA', [354]);

          // add date header if missing

          if (Msg.Headers.Values['date'] = '') then
            smtp.IOHandler.WriteLn('Date: ' + DateTimeToInternetStr(Now));

          // send message line by line

          sl := TStringList.Create;
          try
            sl.Text := messageContent;
            header  := true;
            for i := 0 to sl.Count - 1 do
            begin
              if (i = 0) and (sl[i] = '') then
                continue;
              if (sl[i] = '') then
                header := false;
              if (header) and (LowerCase(copy(sl[i], 1, 5)) = 'bcc: ') then
                continue;
              smtp.IOHandler.WriteLn(sl[i]);
            end;
          finally
            sl.Free;
          end;

          // done

          smtp.SendCmd('.', [250]);
          try
            smtp.SendCmd('QUIT');
          except
            on e:EIdConnClosedGracefully do
              ;// ignore
            on e:Exception do
              raise;
          end;

        finally

          if (smtp.Connected) then
            debugLog('Disconnecting from ' + smtp.Host + ':' + intToStr(smtp.Port));

          smtp.Free;
        end;

      finally
        msg.Free;
        ss.Free;
      end;

    end;

  except
    on e:Exception do
    begin
      writeln(ErrOutput, 'sendmail: Error during delivery: ' + e.message);
      errorLog(e.Message);
      {$IFDEF USE_MADEXCEPT}
      raise;
      {$ELSE}
      halt(1);
      {$ENDIF}
    end;
  end;

end.

