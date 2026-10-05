package com.example.demo.controllers;

import java.math.BigDecimal;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entities.Membership;
import com.example.demo.entities.User;
import com.example.demo.repos.UserRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;

@RestController
@RequestMapping("/payment")
public class PaymentController {

    @Autowired
    private RazorpayClient razorpayClient;

    @Autowired
    private UserRepository userRepository;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;


    // Create Razorpay Order
    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(
            @RequestParam BigDecimal amount) {

        try {

            // Razorpay amount is in paise
            int amountInPaise = amount
                    .multiply(BigDecimal.valueOf(100))
                    .intValue();

            JSONObject orderRequest = new JSONObject();

            orderRequest.put("amount", amountInPaise);
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "movie_gold_receipt");

            Order order =
                    razorpayClient.orders.create(orderRequest);

            return ResponseEntity.ok(order.toString());

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                        "Payment order creation failed: "
                        + e.getMessage()
                    );
        }
    }


    // Verify Payment and Upgrade User to GOLD
    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(
            @RequestBody String paymentData,
            Authentication authentication) {

        try {

            // Convert payment data to JSON
            JSONObject paymentDetails =
                    new JSONObject(paymentData);


            // Get Razorpay payment details
            String razorpayOrderId =
                    paymentDetails.getString(
                            "razorpay_order_id");

            String razorpayPaymentId =
                    paymentDetails.getString(
                            "razorpay_payment_id");

            String razorpaySignature =
                    paymentDetails.getString(
                            "razorpay_signature");


            // Prepare data for signature verification
            JSONObject options =
                    new JSONObject();

            options.put(
                    "razorpay_order_id",
                    razorpayOrderId);

            options.put(
                    "razorpay_payment_id",
                    razorpayPaymentId);

            options.put(
                    "razorpay_signature",
                    razorpaySignature);


            // Verify Razorpay signature
            boolean isValid =
                    Utils.verifyPaymentSignature(
                            options,
                            razorpayKeySecret);


            // Payment verification failed
            if (!isValid) {

                return ResponseEntity
                        .badRequest()
                        .body(
                            "Payment verification failed"
                        );
            }


            // Get logged-in user's email
            String email =
                    authentication.getName();


            // Find user from database
            User user =
                    userRepository.findByEmail(email)
                    .orElseThrow(
                        () -> new RuntimeException(
                            "User not found"
                        )
                    );


            // Upgrade membership
            user.setMembership(Membership.GOLD);


            // Save updated user
            User updatedUser =
                    userRepository.save(user);


            return ResponseEntity.ok(updatedUser);


        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                        "Payment verification error: "
                        + e.getMessage()
                    );
        }
    }
}