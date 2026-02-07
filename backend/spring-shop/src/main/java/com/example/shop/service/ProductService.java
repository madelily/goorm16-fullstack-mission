package com.example.shop.service;

import com.example.shop.domain.product.Product;
import com.example.shop.repository.ProductRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public Product create(Product product) {
        return productRepository.save(product);
    }

    @Transactional(readOnly = true)
    public List<Product> findAll() {
        return productRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Product findById(Long id) {
        return productRepository.findById(id).orElseThrow(ProductNotFoundException::new);
    }

    public Product update(Long id, Product updatedProduct) {
        Product product = productRepository.findById(id).orElseThrow(ProductNotFoundException::new);
        product.setName(updatedProduct.getName());
        product.setPrice(updatedProduct.getPrice());
        product.setStock(updatedProduct.getStock());
        product.setDescription(updatedProduct.getDescription());
        return product;
    }

    public void delete(Long id) {
        Product product = productRepository.findById(id).orElseThrow(ProductNotFoundException::new);
        productRepository.delete(product);
    }
}
