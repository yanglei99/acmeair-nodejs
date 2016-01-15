	curl --cookie cookies1.txt --cookie-jar newcookies1.txt  -d "login=uid23@email.com&password=password" http://localhost:9080/rest/api/login
	curl --cookie newcookies1.txt -d "fromAirport=JFK&toAirport=CDG&fromDate=Thu+Jan+14+00:00:00+EST+2016&returnDate=Thu+Jan+14+00:00:00+EST+2016&oneWay=false" http://localhost:9080/rest/api/flights/queryflights
	curl --cookie newcookies1.txt -o customer.json http://localhost:9080/rest/api/customer/byid/uid23@email.com
	curl -H 'Content-Type: application/json' --cookie newcookies1.txt -d@customer.json http://localhost:9080/rest/api/customer/byid/uid23@email.com
	curl -H 'Content-Type: application/json' --cookie newcookies1.txt -d '{"userid":"uid23@email.com","toFlightId":"abb520b2-af27-4e12-9c9c-d5b06fcb80eb","retFlightId":"a24462ba-ffe0-494f-9cfa-45a9dbd18506","oneWayFlight":"false"}'  http://localhost:9080/rest/api/bookings/bookflights
	curl --cookie newcookies1.txt http://localhost:9080/rest/api//bookings/byuser/uid23@email.com
	curl --cookie newcookies1.txt -d '{"user":"uid23@email.com,"number":"d7823edc-6564-4f6b-a5a2-cd69158d3afa"}' http://localhost:9080/rest/api/bookings/cancelbooking
	curl --cookie newcookies1.txt http://localhost:9080/rest/api/login/logout
	curl -XPOST http://localhost:9443/rest/api/auth-service/authtoken/byuserid/uid0@email.com
	curl http://localhost:9443/rest/api/auth-service/authtoken/4bbd555f-e1f5-453c-b3e4-336875bc3e43
	curl -XDELETE http://localhost:9443/rest/api/auth-service/authtoken/4bbd555f-e1f5-453c-b3e4-336875bc3e43
