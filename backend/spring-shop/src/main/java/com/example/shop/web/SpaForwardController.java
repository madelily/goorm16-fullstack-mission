package com.example.shop.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaForwardController {

    @GetMapping({
            "/login",
            "/signup",
            "/password-reset",
            "/products",
            "/products/**",
            "/orders",
            "/orders/**"
    })
    public String forwardToIndex() {
        return "forward:/index.html";
    }
}

