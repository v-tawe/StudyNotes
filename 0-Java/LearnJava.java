
/**
 * default package
 */

import java.io.BufferedWriter;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.Writer;
import java.net.InetSocketAddress;
import java.net.URLDecoder;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.GeneralSecurityException;
import java.security.KeyStore;
import java.util.Base64;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicLong;

import javax.net.ssl.KeyManagerFactory;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLEngine;
import javax.net.ssl.TrustManagerFactory;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpsConfigurator;
import com.sun.net.httpserver.HttpsParameters;
import com.sun.net.httpserver.HttpsServer;

/**
 * A simple https server for running java code.
 * 
 * For more information please visit https://www.liaoxuefeng.com/
 * 
 * @author liaoxuefeng
 */
public class LearnJava {

	public static void main(String[] args) throws IOException, GeneralSecurityException, InterruptedException {
		KeyStore keystore = KeyStore.getInstance("JKS");
		keystore.load(new ByteArrayInputStream(Base64.getDecoder().decode(KEYSTORE_DATA)), KEYSTORE_PASSWD);
		KeyManagerFactory kmf = KeyManagerFactory.getInstance("SunX509");
		kmf.init(keystore, KEYSTORE_PASSWD);
		// setup the trust manager factory
		TrustManagerFactory tmf = TrustManagerFactory.getInstance("SunX509");
		tmf.init(keystore);
		// create https server
		HttpsServer server = HttpsServer.create(new InetSocketAddress(39193), 0);
		// create ssl context
		SSLContext sslContext = SSLContext.getInstance("SSL");
		// setup the HTTPS context and parameters
		sslContext.init(kmf.getKeyManagers(), tmf.getTrustManagers(), null);
		server.setHttpsConfigurator(new HttpsConfigurator(sslContext) {
			public void configure(HttpsParameters params) {
				try {
					// initialise the SSL context
					SSLContext c = SSLContext.getDefault();
					SSLEngine engine = c.createSSLEngine();
					params.setNeedClientAuth(false);
					params.setCipherSuites(engine.getEnabledCipherSuites());
					params.setProtocols(engine.getEnabledProtocols());
					params.setSSLParameters(c.getDefaultSSLParameters());
				} catch (Exception ex) {
					ex.printStackTrace();
					System.out.println("Failed to create HTTPS server");
				}
			}
		});
		server.createContext("/", new CodeHandler());
		server.start();
		System.out.println("Ready for Java code on port 39193...\nPress Ctrl + C to exit...");
	}

	static ProcessResult runJavaProgram(String code) throws IOException, InterruptedException {
		String tmpDir = System.getProperty("java.io.tmpdir");
		File pwd = Paths.get(tmpDir, String.format("%016x", nextLong.incrementAndGet())).toFile();
		pwd.mkdirs();
		try (Writer writer = new BufferedWriter(new FileWriter(new File(pwd, "Main.java"), Charset.defaultCharset()))) {
			writer.write(code);
		}
		String[] command = new String[] { getJavaExecutePath(), "--source", "12", "--enable-preview", "Main.java" };
		System.out.println(String.format("cd %s\n%s", pwd.toString(), String.join(" ", command)));
		ProcessBuilder pb = new ProcessBuilder().command(command).directory(pwd);
		pb.redirectErrorStream(true);
		Process p = pb.start();
		if (p.waitFor(5, TimeUnit.SECONDS)) {
			String result = null;
			try (InputStream input = p.getInputStream()) {
				result = readAsString(input, Charset.defaultCharset());
			}
			return new ProcessResult(p.exitValue(), result);
		} else {
			System.err.println(String.format("Error: process %s timeout. destroy forcibly.", p.pid()));
			p.destroyForcibly();
			return new ProcessResult(p.exitValue(), "Timeout.");
		}
	}

	static class CodeHandler implements HttpHandler {
		@Override
		public void handle(HttpExchange exchange) throws IOException {
			String method = exchange.getRequestMethod();
			if ("GET".equals(method)) {
				sendResult(exchange, 0, "Server is ready.");
			} else {
				String body = readAsString(exchange.getRequestBody(), StandardCharsets.UTF_8);
				if (!body.startsWith("code=")) {
					sendResult(exchange, 1, "No code found.");
				} else {
					String code = URLDecoder.decode(body.substring(5), StandardCharsets.UTF_8);
					System.out.println("========== prepare running code ==========");
					System.out.println(code);
					System.out.println("==========================================");
					try {
						ProcessResult result = runJavaProgram(code);
						System.out.println("================= result =================");
						System.out.println("exit code: " + result.exitCode);
						System.out.println(result.output);
						System.out.println("==========================================");
						sendResult(exchange, result.exitCode, result.output);
					} catch (InterruptedException e) {
						sendResult(exchange, 1, e.toString());
					}
				}
			}
		}

		void sendResult(HttpExchange exchange, int exitCode, String output) throws IOException {
			if (output.isEmpty()) {
				output = "(no output)";
			}
			sendData(exchange,
					String.format("{\"exitCode\":%s,\"output\":\"%s\"}", exitCode, encodeJsonString(output)));
		}

		void sendData(HttpExchange exchange, String s) throws IOException {
			String origin = exchange.getRequestHeaders().getOrDefault("Origin", List.of("https://www.liaoxuefeng.com"))
					.get(0);
			exchange.getResponseHeaders().set("Content-Type", "application/json");
			exchange.getResponseHeaders().set("Access-Control-Allow-Origin", origin);
			exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET,POST");
			exchange.getResponseHeaders().set("Access-Control-Max-Age", "86400");
			exchange.sendResponseHeaders(200, 0);
			OutputStream os = exchange.getResponseBody();
			os.write(s.getBytes(StandardCharsets.UTF_8));
			os.close();
		}
	}

	static class ProcessResult {
		int exitCode;
		String output;

		public ProcessResult(int exitCode, String output) {
			this.exitCode = exitCode;
			this.output = output;
		}
	}

	static String readAsString(InputStream input, Charset charset) throws IOException {
		ByteArrayOutputStream output = new ByteArrayOutputStream();
		byte[] buffer = new byte[102400];
		for (;;) {
			int n = input.read(buffer);
			if (n == (-1)) {
				break;
			}
			output.write(buffer, 0, n);
		}
		return output.toString(charset);
	}

	static String encodeJsonString(String s) {
		StringBuilder sb = new StringBuilder(s.length() + 1024);
		for (int i = 0; i < s.length(); i++) {
			char ch = s.charAt(i);
			switch (ch) {
			case '\"':
				sb.append("\\\"");
				break;
			case '\\':
				sb.append("\\\\");
				break;
			case '/':
				sb.append("\\/");
				break;
			case '\b':
				sb.append("\\b");
				break;
			case '\f':
				sb.append("\\f");
				break;
			case '\n':
				sb.append("\\n");
				break;
			case '\r':
				sb.append("\\r");
				break;
			case '\t':
				sb.append("    ");
				break;
			default:
				sb.append(ch);
				break;
			}
		}
		return sb.toString();
	}

	static String getJavaExecutePath() {
		if (javaExec == null) {
			String javaHome = System.getProperty("java.home");
			String os = System.getProperty("os.name");
			boolean isWindows = os.toLowerCase().startsWith("windows");
			Path javaPath = Paths.get(javaHome, "bin", isWindows ? "java.exe" : "java");
			javaExec = javaPath.toString();
		}
		return javaExec;
	}

	static String javaExec = null;

	static AtomicLong nextLong = new AtomicLong(System.currentTimeMillis());

	static char[] KEYSTORE_PASSWD = "qf84g6s8c73w7".toCharArray();

	static String KEYSTORE_DATA = "/u3+7QAAAAIAAAABAAAAAQAVbG9jYWwubGlhb3h1ZWZlbmcuY29tAAABa8pP3aIAAAUCMIIE/jAOBgorBgEEASoCEQEBBQAEggTqkMQzRQVR8hxtxLd876B3x0Nvh3BvP24IT7Pn3m0So/xZ4OQEEfY9RAmKVK3U7fWdDZqibsP3af5qXx4i26bT+qPq1+Qdc3g7mJ4TzClD7P283ifowlqtIlpfI3xvlhzYTwQns/6JQdL6YDevhdA/FsMMMrJF9GFV9+nU"
                                + "Q5TYuPKKqow81Zv5/jISiJcjSLtNBMr2gZCYsVnTfzpwnwttwYGBSP2BzO3rLJw8KCwRMP8f+8keXc7Kd31ewL7atdwonFKqWrtL8WJK/BWlTVFnGjT2YAAb/7uFbOzqC7MYiaeLUc2NsAq+kSLX9FMgB+3FXaBEe6iy2w3Dtt+htDfy4RzAoNTInGi6HfQXrQK1BvTKAWoOnlRSBiIeeaduNxHOD+xSd+w6ZNyBVZaseIYZGtEW2Ld9EZ8hWjfY3Ls41SPG"
                                + "9Wavl6nU/v7au9OYcutKdyRFEgVBUPVFG4m+TAKJAQ3+zEZTjJIX33jgo22Sz8EmCKvMCpMS4TfEZfx86p6xYwzgTfZdGR/Z+nVyBdFsBayzpzFcGCeiiak/236/0dm7DwxAilicdVfBXe3uyCA06QBX6X/sUiL00CPwFgZbzMV5TLRlHTxgYR1PO0a7HVcNXyl0B5mGQn6iEuny6mbO/Cqql2iT22Yv2Sz46DIpUllqOEX21SaFLu0TK+NIxOYHwI3AHCoA"
                                + "F1aPHXcpQZHMpHX8D3Uwrw0Vo4fAxdxBRWabhbuJZXC1v+5XRrxCRHq96WtY8vZIyIQ1hrnrMrj7uL1436cZAE5qmKM42Jw/OuBN0mHu4+P/e1RNvbTAnunhbBpMjpf/wNv1VgEr9f5puj/HRTe01TeztDTKNgvFStmGFUws4fgxIl3PgH7Q6hNPI/RvyK9aVB1KZXjUwkA/AjByoy0Rrjpyak8xXjY7M0Zkq/CRG6iOw+GmGYqm56XtSe+ad3IlEfpKA0jy"
                                + "a2XAnUEIjDW9XGyMVp/ZDzLhovZCyKyMrfaighotlhDanoIH0PLp4zRPKSspnNIPmpcYoULZPfN0AVxqXL6nO+kHv50AgiUElz4U8wn0mfSzEBEehEh9h5NoCxBNJ7yq4mA6syfR58itKAtjUMkXtTcR49kL+qTLFA6yPYJDc2UOhqQXlxtK1bUXi+5NfM3c7MlBIgyYDQjEplDX3scZfBR9qfDSWZWFHLjHBL7g8JTliD5KDSjxMa4d5NlHCYR14n0jvJ9a"
                                + "I9a+bq+2X6opKA5j1cp0aHo5SwpsWU0Z63IzSwTXnsvfWLZK1ghWeJwHtP2F96C1RjfdqF0Bz3ghbc12ZH/2UIfOItfk3cTdyS8GEmur/1ErFqIln8+XIYg+0VZFvewLjT5QEdbO8XYX56GueWT6Dfl21k8jzYxY/EvaTErOZCzpnP/+lOJm9YkHvY9xUGq1ZPty0/AXGa0hflbvd38whX2FGthQOeo9GByFhXDdfUZ1tdPReQMkQDLIcjkBT7Yb0ptGABDy"
                                + "e1KFAj77Dh1Ch/m7G2eZILNu8niFq+Tj8q+KsgK2Pkt6uyKW2w/ui4eYrVSxavcA0WrzVg8gUEUiUZ4Igjpa4aHCQVmf1fjzQrJNt5NrUzz1pMQtHlOL5Wbp+UWvbviZ+c6S1GjpQ0Clp78Bf1f0lKHYMwe/9IGwGFAIO7Ut2V/2wcgPv4Q4NRrDdYOiE/4iIAAAAAQABVguNTA5AAAFljCCBZIwggR6oAMCAQICEALe8bRaibIEWRrykTMjvZ4wDQYJKoZI"
                                + "hvcNAQELBQAwcjELMAkGA1UEBhMCQ04xJTAjBgNVBAoTHFRydXN0QXNpYSBUZWNobm9sb2dpZXMsIEluYy4xHTAbBgNVBAsTFERvbWFpbiBWYWxpZGF0ZWQgU1NMMR0wGwYDVQQDExRUcnVzdEFzaWEgVExTIFJTQSBDQTAeFw0xOTA2MDkwMDAwMDBaFw0yMDA4MDcxMjAwMDBaMCAxHjAcBgNVBAMTFWxvY2FsLmxpYW94dWVmZW5nLmNvbTCCASIwDQYJ"
                                + "KoZIhvcNAQEBBQADggEPADCCAQoCggEBAK1LV+b0SO0bAgRDfLCD7JEMiyYbF88UPeO3XB9rKNLrgmKHZsJLisDLYwrz+Z5zNj0WiTEg95HuDgNgXQ/glhhZqF3Q/MiWwDoenWuG6DotkYde+GJWS3KRgYW6qa15UQtSKdI81t/MuHTlvZvS9UBAC6B2eryRtbGKLixHzy7myPfm4FTtVoqRwXm7k+DqLIr7CcQYTantXUe6wpAo1db/4gZmyQro6x/a64td"
                                + "i5pLC9B4Vu1eZnHGntO5mqNLX7tXrBXi6mFjO/oXkPNql8INVn287V1iZD9PPHz4xRlkgFXGUvUczxLf5Qt+CH9eQKkhK+tMyg5ENaJVN+mBzvsCAwEAAaOCAnQwggJwMB8GA1UdIwQYMBaAFH/TmfOgRw4xAFZWIo63zJ7dygGKMB0GA1UdDgQWBBTntw3nOcB25OR3/Iepdgwx4B8R4TAgBgNVHREEGTAXghVsb2NhbC5saWFveHVlZmVuZy5jb20wDgYD"
                                + "VR0PAQH/BAQDAgWgMB0GA1UdJQQWMBQGCCsGAQUFBwMBBggrBgEFBQcDAjBMBgNVHSAERTBDMDcGCWCGSAGG/WwBAjAqMCgGCCsGAQUFBwIBFhxodHRwczovL3d3dy5kaWdpY2VydC5jb20vQ1BTMAgGBmeBDAECATB9BggrBgEFBQcBAQRxMG8wIQYIKwYBBQUHMAGGFWh0dHA6Ly9vY3NwLmRjb2NzcC5jbjBKBggrBgEFBQcwAoY+aHR0cDovL2NhY2Vy"
                                + "dHMuZGlnaXRhbGNlcnR2YWxpZGF0aW9uLmNvbS9UcnVzdEFzaWFUTFNSU0FDQS5jcnQwCQYDVR0TBAIwADCCAQMGCisGAQQB1nkCBAIEgfQEgfEA7wB1AKS5CZC0GFgUh7sTosxncAo8NZgE+RvfuON3zQ7IDdwQAAABazoiPsoAAAQDAEYwRAIgBpcdM9mE4EDMlb2uXkWU568tK1Izxgl1j9WOP14KTvcCIEgbSHwoxxgvsS7r1DhEGQH54esaAxSerq05"
                                + "P7XZCfwWAHYAh3W/51l8+IxDmV+9827/Vo1HVjb/SrVgwbTq/16ggw8AAAFrOiI/lgAABAMARzBFAiEAzaiRvvK+SMFwzix8n1JIPF6ZGjGI53BOZkjC8Mqa7dYCICwIpWk7T9M5Wq9dZ9y01Yc/1xvKOZFKBSIKbP3A0jzdMA0GCSqGSIb3DQEBCwUAA4IBAQBDxT6mRNN7tOj2fYzKaJHuAlxxd4kwQAbkwP/4OsOz5/w5TLh7OTktkuEV0LOUCX3S6Uu0"
                                + "7GGrWJn4Qzvm9d0LgTP9PQRYfil7CSE20vaJsvHgfyCvjhgiCcKI9abKFOLcPzDtrJcuTfK4CYGMrQ9VNPgWwyIVmNY5SpT9605FdTpKBnzxc446pOVSIjXRl6p/2nlzG8nG8ssgxsIS5qjAEVi4g70C8sMM7nBsSUuLPqD+EiGFR/rH8hudX0UkyMqsyPLT9TDbj4tUeq/PDYo8kPn/7ULPEdzgfgB3LYYKqekyOarDfPbyc6g+DUwQawnMlNT7IVuawIyX"
                                + "pZyZZnyFAAVYLjUwOQAABLIwggSuMIIDlqADAgECAhAFgCZ/BvKVUzSOHBhaXu4uMA0GCSqGSIb3DQEBCwUAMGExCzAJBgNVBAYTAlVTMRUwEwYDVQQKEwxEaWdpQ2VydCBJbmMxGTAXBgNVBAsTEHd3dy5kaWdpY2VydC5jb20xIDAeBgNVBAMTF0RpZ2lDZXJ0IEdsb2JhbCBSb290IENBMB4XDTE3MTIwODEyMjgyNloXDTI3MTIwODEyMjgyNlowcjEL"
                                + "MAkGA1UEBhMCQ04xJTAjBgNVBAoTHFRydXN0QXNpYSBUZWNobm9sb2dpZXMsIEluYy4xHTAbBgNVBAsTFERvbWFpbiBWYWxpZGF0ZWQgU1NMMR0wGwYDVQQDExRUcnVzdEFzaWEgVExTIFJTQSBDQTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAKBZr1f6mH7ACbxiHUWTUyMptDlDAE44pVplH858KH4Xp/3e7u9kcZxRT+W9UaBRCdvMmFHV"
                                + "RXZ6klp76btzGdcgp0PT9VL1u0CDAmzMYW/Cipd5oKoWg/vXA+ZeONTAtPvT6q9fiF3Jh84lyN5PPlAq2DzNDDFor3HglP0Kg6ahV1WEQECIPcPBHl8WA4cPDAbF0lZUG+S2egDON1MtcN1tJULmNnS7yir0GJMO/uMCWwHkXxpmC9JkM5B4WvBo5NspZIQicSGdyEplMPV3PpoGWTXEYQjk9lYCdUBtr+h8ffeS3KZpMOwTrFEOdb3ukOSKYJFqToIRt97d"
                                + "1fDo5XkCAwEAAaOCAU8wggFLMB0GA1UdDgQWBBR/05nzoEcOMQBWViKOt8ye3coBijAfBgNVHSMEGDAWgBQD3lA1VtFMu2bwo+IbG8OXsj3RVTAOBgNVHQ8BAf8EBAMCAYYwHQYDVR0lBBYwFAYIKwYBBQUHAwEGCCsGAQUFBwMCMBIGA1UdEwEB/wQIMAYBAf8CAQAwNAYIKwYBBQUHAQEEKDAmMCQGCCsGAQUFBzABhhhodHRwOi8vb2NzcC5kaWdpY2Vy"
                                + "dC5jb20wQgYDVR0fBDswOTA3oDWgM4YxaHR0cDovL2NybDMuZGlnaWNlcnQuY29tL0RpZ2lDZXJ0R2xvYmFsUm9vdENBLmNybDBMBgNVHSAERTBDMDcGCWCGSAGG/WwBAjAqMCgGCCsGAQUFBwIBFhxodHRwczovL3d3dy5kaWdpY2VydC5jb20vQ1BTMAgGBmeBDAECATANBgkqhkiG9w0BAQsFAAOCAQEArd1U6Pl2W/gzMraLbfeUNi/IneyUVjZfYcpN"
                                + "ga17ydsrqLn9+wMiYxiKECSnpVo1j96fxZnmpytA9Uu4mskNJdPTg2cx5k5ANSiP80cCZ18IEH+HVtnk4YrpJ/WHljH/nBHh/dNSg+AaWdTsS48hIs10xGIOtee1wiYMCJG+SHkYm4fhgJUTpcSe2po0iAaRHDEpKCdTch3eK4Vtb0VRD1Cq1vUZf3UAnuLjXndOKQaBgJ3BiQFREPyBJV7w4Byjoh9k5i39MTCKLUi+LUKqe5SVamwXUt1A0h19tbdNJ7QG"
                                + "FBruJ9tUh+89Ydg67euSDVl4yjpdFT0HiflXIlhGYQAFWC41MDkAAARkMIIEYDCCA0igAwIBAgIQD1vDoXbLeJ4gIMeJPIFntDANBgkqhkiG9w0BAQsFADBaMQswCQYDVQQGEwJJRTESMBAGA1UEChMJQmFsdGltb3JlMRMwEQYDVQQLEwpDeWJlclRydXN0MSIwIAYDVQQDExlCYWx0aW1vcmUgQ3liZXJUcnVzdCBSb290MB4XDTE2MTIwNzEyMTczNFoX"
                                + "DTI1MDUxMDEyMDAwMFowYTELMAkGA1UEBhMCVVMxFTATBgNVBAoTDERpZ2lDZXJ0IEluYzEZMBcGA1UECxMQd3d3LmRpZ2ljZXJ0LmNvbTEgMB4GA1UEAxMXRGlnaUNlcnQgR2xvYmFsIFJvb3QgQ0EwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDiO+ERct6opNOjV6pQoo8Ld5DJoqXuEs6WWwEJIMwBk6dOMLdT90PEaQBXneKNIt2HBkAA"
                                + "gQnOzhuDv9/NO3FG4tZmxwWzdicWj3ueHpV97rdIowja1q96DDkGZX9KXR+8F/irvu4o13R/eniZWYVoblwjMku/TsDoWm3jcL93EL/8AfaF2ahEEFgyqXUY1dGivkfiJ2r0mjP4SQhgi9RftDqEv6GqSkx9Ps9PX2x2XqBLN5Ge3CLmbc4UGo5qy/7NsxRkF8dbKZ4yv/Lu+tMLQtSrt0Ey2gzU7/iB1buNWD+1G+hJKKJw2jEE3feyFvJMCk4HqO1KPV61"
                                + "f6OQw68nAgMBAAGjggEZMIIBFTAdBgNVHQ4EFgQUA95QNVbRTLtm8KPiGxvDl7I90VUwHwYDVR0jBBgwFoAU5Z1ZMIJHWMys+ghUNoZ7OrUETfAwEgYDVR0TAQH/BAgwBgEB/wIBATAOBgNVHQ8BAf8EBAMCAYYwNAYIKwYBBQUHAQEEKDAmMCQGCCsGAQUFBzABhhhodHRwOi8vb2NzcC5kaWdpY2VydC5jb20wOgYDVR0fBDMwMTAvoC2gK4YpaHR0cDov"
                                + "L2NybDMuZGlnaWNlcnQuY29tL09tbmlyb290MjAyNS5jcmwwPQYDVR0gBDYwNDAyBgRVHSAAMCowKAYIKwYBBQUHAgEWHGh0dHBzOi8vd3d3LmRpZ2ljZXJ0LmNvbS9DUFMwDQYJKoZIhvcNAQELBQADggEBAJpjvIPfXiuDFKs7G+h76taX2ng1O+Xvso30ZOdkK3BxeQdlK0sEvgirezuU20S65oIsvWUwbDY0Um79fgqvCOig0TfuYmz/jwQ0T+BcccaG"
                                + "DUGZZLbHbx1nb3ujzvb/suLwN8tfwfSCvue+8aNoucVyDtpSS5ecbcaYYL/rjOQWeiMSj6bREEM2jz7qMgQTlIZcus2tqWuOMyXUI/ibz31TWGiMBGu9jkybdV5LYiKUWxCA7kxqiUDHeBH8dQt6sFgaFjiUki4bSNrRevngFmMSUYGMkLGELj//so6ofkw4av9cXBZYqIX/XcCj+KgVQK8z7A0yUhkfMgnzZT6StIQABVguNTA5AAADezCCA3cwggJfoAMC"
                                + "AQICBAIAALkwDQYJKoZIhvcNAQEFBQAwWjELMAkGA1UEBhMCSUUxEjAQBgNVBAoTCUJhbHRpbW9yZTETMBEGA1UECxMKQ3liZXJUcnVzdDEiMCAGA1UEAxMZQmFsdGltb3JlIEN5YmVyVHJ1c3QgUm9vdDAeFw0wMDA1MTIxODQ2MDBaFw0yNTA1MTIyMzU5MDBaMFoxCzAJBgNVBAYTAklFMRIwEAYDVQQKEwlCYWx0aW1vcmUxEzARBgNVBAsTCkN5YmVy"
                                + "VHJ1c3QxIjAgBgNVBAMTGUJhbHRpbW9yZSBDeWJlclRydXN0IFJvb3QwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCjBLsiq5g9V+gmcpq1edQp4uHolYCxsONbjispmmTfoV3tsAkFbdsoLs5iomL+tIjaEus46yGdwEErAVJ7iHfTHI/HurmItWoJ53PoEUCn0czKYo0t5Y8LplDSqFDDKOr1qyWHipqWHKlnuD8M1ff5UhMvwhvVcHDwj8AS"
                                + "ygbLmuHZyjN6d9b47LnxaERCSBPSwMKkrl5g/ramBfy03QdZAtRZGJhj9aVj4JAMfV2yBnrzherr1AOuXoQ+X/8V7Wm8+Tk2cnXPd1JN88mQLLk95ckjUz8fJJghXAeZKb3GOuznboY6a5d0YzO9aBgx8HiNdr/8no5dKoanTZDcJxo5AgMBAAGjRTBDMB0GA1UdDgQWBBTlnVkwgkdYzKz6CFQ2hns6tQRN8DASBgNVHRMBAf8ECDAGAQH/AgEDMA4GA1Ud"
                                + "DwEB/wQEAwIBBjANBgkqhkiG9w0BAQUFAAOCAQEAhQxdjuRvUWhCBaDdu08nJYQDvfdk/S3XMOOkEBfr2ikptnk/dvYZEyO4EAr5WKTUYXC9BGFqEooX1Qq9xbwwfNbpDCWNhkBP7MyjfjjGNxFP7d1oMY5M0rMBdO6+dV4HSBp/cP8WXITAeYW4Bf1/vmURow/AArT4Ujc5BNWpMXoYv6Aq9BKZ96NFguM8XvWdnrXInnwuyKSeTggUS239cG1rGmO9ZOYf"
                                + "t87w8p8uuxu38lCIc5LC4uMWjZoyAquOGN3pEBHufjWrkK8+MJR60DM9p2UP9fyOnmLPR0QsAV27HbUy0kfSOC7Q/oHcMmoete481fzngR0ZwyRC6mM5qctq6MxH5XyU5tv0/X+nWWYFVAOL";

}
