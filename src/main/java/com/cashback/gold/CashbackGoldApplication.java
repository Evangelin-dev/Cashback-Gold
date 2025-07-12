package com.cashback.gold;

import com.cashback.gold.config.MetalApiProperties;
import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication(scanBasePackages = "com.cashback.gold")
@EnableConfigurationProperties(MetalApiProperties.class)
public class CashbackGoldApplication {

	public static void main(String[] args) {
		// ✅ Load .env from project root
		Dotenv dotenv = Dotenv.configure()
				.directory("./") // or use "."
				.ignoreIfMissing()
				.load();

		// ✅ Set all entries as system properties so Spring can resolve them
		dotenv.entries().forEach(entry ->
				System.setProperty(entry.getKey(), entry.getValue())
		);

		// ✅ Start Spring Boot
		SpringApplication.run(CashbackGoldApplication.class, args);
	}
}
