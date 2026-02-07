package com.example.shop.service;

import java.security.SecureRandom;

public class TempPasswordGenerator {

    private static final SecureRandom RANDOM = new SecureRandom();
    private static final char[] ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%".toCharArray();

    private TempPasswordGenerator() {
    }

    public static String generate(int length) {
        if (length < 10) {
            throw new IllegalArgumentException("length must be >= 10");
        }

        char[] out = new char[length];
        for (int i = 0; i < length; i++) {
            out[i] = ALPHABET[RANDOM.nextInt(ALPHABET.length)];
        }
        return new String(out);
    }
}

