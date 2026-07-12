package com.transitops.user.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.transitops.user.entity.User;
import com.transitops.user.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
	@Autowired
    private  UserService service;

    @PostMapping
    public User createUser(@RequestBody User user) {
    	System.out.println(user);    
    	return service.save(user);
    }

    @GetMapping
    public List<User> getAllUsers() {
        return service.getAllUsers();
    }
}