package com.example.shop.service;

import com.example.shop.domain.order.Order;
import com.example.shop.domain.order.OrderItem;
import com.example.shop.domain.order.OrderStatus;
import com.example.shop.domain.product.Product;
import com.example.shop.domain.user.User;
import com.example.shop.repository.OrderItemRepository;
import com.example.shop.repository.OrderRepository;
import com.example.shop.repository.ProductRepository;
import com.example.shop.repository.UserRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public OrderService(
            OrderRepository orderRepository,
            OrderItemRepository orderItemRepository,
            UserRepository userRepository,
            ProductRepository productRepository
    ) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    public Order createOrder(Long userId, Long productId, int quantity) {
        if (quantity <= 0) {
            throw new IllegalStateException("quantity는 1 이상이어야 합니다.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalStateException("사용자를 찾을 수 없습니다."));

        Product product = productRepository.findById(productId)
                .orElseThrow(ProductNotFoundException::new);

        if (product.getStock() < quantity) {
            throw new IllegalStateException("재고가 부족합니다.");
        }

        int priceAtOrder = product.getPrice();
        int totalPrice = priceAtOrder * quantity;

        Order order = new Order(user, totalPrice, OrderStatus.CREATED);
        Order savedOrder = orderRepository.save(order);

        OrderItem orderItem = new OrderItem(savedOrder, product, quantity, priceAtOrder);
        orderItemRepository.save(orderItem);

        savedOrder.getUser().getId();
        return savedOrder;
    }

    @Transactional(readOnly = true)
    public List<Order> findAll() {
        List<Order> orders = orderRepository.findAll();
        for (Order order : orders) {
            order.getUser().getId();
        }
        return orders;
    }

    @Transactional(readOnly = true)
    public Order findById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new IllegalStateException("주문을 찾을 수 없습니다."));
        order.getUser().getId();
        return order;
    }

    public Order pay(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalStateException("주문을 찾을 수 없습니다."));

        if (order.getStatus() != OrderStatus.CREATED) {
            throw new IllegalStateException("결제할 수 없는 주문 상태입니다.");
        }

        List<OrderItem> items = orderItemRepository.findByOrderId(orderId);
        if (items.isEmpty()) {
            throw new IllegalStateException("주문 상품을 찾을 수 없습니다.");
        }

        for (OrderItem item : items) {
            Product product = item.getProduct();
            int nextStock = product.getStock() - item.getQuantity();
            if (nextStock < 0) {
                throw new IllegalStateException("재고가 부족합니다.");
            }
            product.setStock(nextStock);
        }

        order.setStatus(OrderStatus.PAID);
        Order savedOrder = orderRepository.save(order);
        savedOrder.getUser().getId();
        return savedOrder;
    }
}
