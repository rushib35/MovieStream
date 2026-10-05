import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./GoldMembership.css";

function GoldMembership() {

    const navigate = useNavigate();

    const handleUpgrade = async () => {

        // Get JWT token
        const token = localStorage.getItem("token");

        // Check if user is logged in
        if (!token) {
            alert("Please login first to get Gold Membership.");
            navigate("/login");
            return;
        }

        try {

            // Create Razorpay order
            const response = await axios.post(
                "http://localhost:8080/payment/create-order?amount=199"
            );

            // Convert response to JSON if backend returns string
            const order =
                typeof response.data === "string"
                    ? JSON.parse(response.data)
                    : response.data;

            // Get current logged-in user
            const user = JSON.parse(
                localStorage.getItem("user")
            );


            // Razorpay Checkout options
            const options = {

                // Razorpay Test Key ID
                key: "rzp_test_ThXlCj1zRfozRm",

                amount: order.amount,

                currency: order.currency,

                name: "MovieStream",

                description: "MovieStream Gold Membership",

                order_id: order.id,


                // User information
                prefill: {
                    name: user?.name || "",
                    email: user?.email || ""
                },


                // After successful Razorpay payment
                handler: async function (paymentResponse) {

                    console.log(
                        "Payment ID:",
                        paymentResponse.razorpay_payment_id
                    );

                    console.log(
                        "Order ID:",
                        paymentResponse.razorpay_order_id
                    );

                    console.log(
                        "Signature:",
                        paymentResponse.razorpay_signature
                    );


                    try {

                        // Send payment details to backend
                        const verifyResponse = await axios.post(

                            "http://localhost:8080/payment/verify",

                            {
                                razorpay_payment_id:
                                    paymentResponse.razorpay_payment_id,

                                razorpay_order_id:
                                    paymentResponse.razorpay_order_id,

                                razorpay_signature:
                                    paymentResponse.razorpay_signature
                            },

                            {
                                headers: {
                                    Authorization:
                                        `Bearer ${token}`
                                }
                            }
                        );


                        console.log(
                            "Verification response:",
                            verifyResponse.data
                        );


                        // Get updated user from backend
                        const updatedUser =
                            verifyResponse.data;


                        // Update user information
                        // in localStorage
                        localStorage.setItem(
                            "user",
                            JSON.stringify(updatedUser)
                        );


                        alert(
                            "🎉 Gold Membership activated successfully!"
                        );


                        // Reload application
                        window.location.href = "/";


                    } catch (error) {

                        console.error(
                            "Payment verification error:",
                            error
                        );

                        console.error(
                            "Status:",
                            error.response?.status
                        );

                        console.error(
                            "Response:",
                            error.response?.data
                        );


                        alert(
                            "Payment verification failed."
                        );
                    }
                },


                // If user closes Razorpay
                modal: {

                    ondismiss: function () {

                        console.log(
                            "Razorpay Checkout closed."
                        );

                    }
                },


                // Razorpay checkout theme
                theme: {
                    color: "#f5b301"
                }
            };


            // Open Razorpay Checkout
            const razorpay =
                new window.Razorpay(options);

            razorpay.open();


        } catch (error) {

            console.error(
                "Payment order error:",
                error
            );

            console.error(
                "Status:",
                error.response?.status
            );

            console.error(
                "Response:",
                error.response?.data
            );


            alert(
                "Unable to create payment order."
            );
        }
    };


    // Get current logged-in user
    const user = JSON.parse(
        localStorage.getItem("user")
    );


    return (

        <div className="gold-page">

            <div className="gold-container">

                <div className="gold-icon">
                    ⭐
                </div>


                <h1>MovieStream Gold</h1>


                <p className="gold-subtitle">
                    Unlock exclusive movie trailers and premium content.
                </p>


                <div className="gold-card">

                    <h2>⭐ Gold Membership</h2>


                    <div className="gold-price">
                        ₹199
                        <span>/ month</span>
                    </div>


                    <div className="gold-features">

                        <p>
                            ✓ Watch exclusive Gold trailers
                        </p>

                        <p>
                            ✓ Unlimited trailer access
                        </p>

                        <p>
                            ✓ Premium movie content
                        </p>

                        <p>
                            ✓ No advertisements
                        </p>

                    </div>


                    {user?.membership === "GOLD" ? (

                        <div className="already-gold">
                            🎉 You are already a Gold Member!
                        </div>

                    ) : (

                        <button
                            className="gold-button"
                            onClick={handleUpgrade}
                        >
                            Get Gold Membership
                        </button>

                    )}

                </div>

            </div>

        </div>
    );
}

export default GoldMembership;