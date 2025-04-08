package com.prepaidrecharge.service;

import com.prepaidrecharge.model.SupportQuery;
import com.prepaidrecharge.repository.SupportQueryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class SupportQueryService {

    @Autowired
    private SupportQueryRepository supportQueryRepository;

    // Save a new support query
    public SupportQuery saveQuery(SupportQuery supportQuery) {
        supportQuery.setQueryDate(new Date()); // Set the current date
        return supportQueryRepository.save(supportQuery);
    }
    // Get all support queries
    public List<SupportQuery> getAllQueries() {
        return supportQueryRepository.findAllByOrderByQueryDateDesc();
    }
}