package com.ecommerce.orderservice.service;

import com.ecommerce.orderservice.dto.OrderLineItemsDto;
import com.ecommerce.orderservice.dto.OrderRequest;
import com.ecommerce.orderservice.model.Order;
import com.ecommerce.orderservice.model.OrderLineItems;
import com.ecommerce.orderservice.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
public class OrderService {

    private final OrderRepository orderRepository;

    @Autowired(required = false)
    private KafkaTemplate<String, Object> kafkaTemplate;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public String placeOrder(OrderRequest orderRequest) {
        Order order = new Order();
        order.setOrderNumber(UUID.randomUUID().toString());

        List<OrderLineItems> orderLineItems = orderRequest.getOrderLineItemsDtoList()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());

        order.setOrderLineItemsList(orderLineItems);
        orderRepository.save(order);

        log.info("✅ Order {} saved successfully", order.getOrderNumber());

        // Kafka is optional - gracefully skip if unavailable
        if (kafkaTemplate != null) {
            try {
                kafkaTemplate.send("notificationTopic", order.getOrderNumber());
                log.info("📨 Kafka notification sent for order {}", order.getOrderNumber());
            } catch (Exception e) {
                log.warn("⚠️ Kafka unavailable, notification skipped: {}", e.getMessage());
            }
        } else {
            log.info("ℹ️ Kafka not configured - skipping notification");
        }

        return "Order Placed Successfully - #" + order.getOrderNumber();
    }

    private OrderLineItems mapToDto(OrderLineItemsDto dto) {
        OrderLineItems item = new OrderLineItems();
        item.setPrice(dto.getPrice());
        item.setQuantity(dto.getQuantity());
        item.setSkuCode(dto.getSkuCode());
        return item;
    }
}
