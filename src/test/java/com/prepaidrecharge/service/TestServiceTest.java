package com.prepaidrecharge.service;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class TestServiceTest {

    @Autowired
    private TestService testService;

    @Test
    public void testFindByMobileNo() {
        testService.testFindByMobileNo();
    }
}