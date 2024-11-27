    package tech.buildrun.springPonto.config;

    import org.springframework.context.annotation.Configuration;
    import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
    import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
    import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;


    @Configuration
    @EnableWebSocketMessageBroker
    public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

        @Override
        public void registerStompEndpoints(StompEndpointRegistry registry) {
            registry.addEndpoint("/ws").setAllowedOrigins("http://localhost:3000", "https://hit-poin-api-rest-java.vercel.app").withSockJS(); // Endpoint WebSocket
        }

        @Override
        public void configureMessageBroker(org.springframework.messaging.simp.config.MessageBrokerRegistry config) {
            config.enableSimpleBroker("/topic"); // Prefixo para o broker
            config.setApplicationDestinationPrefixes("/app"); // Prefixo para mensagens enviadas do cliente
        }
    }
