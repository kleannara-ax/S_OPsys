package com.company.module.sales.config;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@Configuration
@EntityScan(basePackages = "com.company.module.sales.entity")
@EnableJpaRepositories(basePackages = "com.company.module.sales.repository")
public class SalesModuleConfig {
}
