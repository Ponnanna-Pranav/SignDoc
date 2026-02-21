package com.signature.signatureapp.config;

import com.signature.signatureapp.security.AuthEntryPointJwt;
import com.signature.signatureapp.security.AuthTokenFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private AuthEntryPointJwt unauthorizedHandler;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Bean
    public AuthTokenFilter authenticationJwtTokenFilter() {
        return new AuthTokenFilter();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder);
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                // ✅ ENABLE CORS FIRST
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .exceptionHandling(exception -> exception.authenticationEntryPoint(unauthorizedHandler))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // ✅ VERY IMPORTANT: allow OPTIONS
                        .requestMatchers(new org.springframework.security.web.util.matcher.AntPathRequestMatcher("/**",
                                "OPTIONS"))
                        .permitAll()
                        .requestMatchers(
                                new org.springframework.security.web.util.matcher.AntPathRequestMatcher("/api/auth/**"))
                        .permitAll()
                        .requestMatchers(
                                new org.springframework.security.web.util.matcher.AntPathRequestMatcher("/api/test/**"))
                        .permitAll()
                        .requestMatchers(
                                new org.springframework.security.web.util.matcher.AntPathRequestMatcher("/error"))
                        .permitAll()
                        .anyRequest().authenticated());

        http.authenticationProvider(authenticationProvider());

        http.addFilterBefore(authenticationJwtTokenFilter(),
                UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
    
        CorsConfiguration configuration = new CorsConfiguration();
    
        configuration.setAllowedOriginPatterns(List.of(
                "http://localhost:5173",
                "https://*.vercel.app"
        ));
    
        configuration.setAllowedMethods(List.of(
                "GET", "POST", "PUT", "DELETE", "OPTIONS"
        ));
    
        configuration.setAllowedHeaders(List.of("*"));
    
        configuration.setExposedHeaders(List.of("Authorization"));
    
        configuration.setAllowCredentials(true);
    
        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();
    
        source.registerCorsConfiguration("/**", configuration);
    
        return source;
    }
}
