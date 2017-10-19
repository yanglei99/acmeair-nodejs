## Acmeair NodeJS on Docker 

Docker image is automatically built on [docker hub](https://hub.docker.com/r/yanglei99/acmeair-nodejs/builds/).


### To Run on Mesos or Mesosphere DC/OS

You can  revise and run the predefined [marathon json](document/marathon) on Mesos cluster.

	curl -i -H 'Content-Type: application/json' -d@document/marathon/$marathonJob.json $marathonIp:8080/v2/apps
	or	
	dcos marathon app add document/marathon/$marathonJob.json
	
You can submit the workload run using [marathon json](document/marathon/acmeair_web_workload.json)


### To Run on Kubernetes

Verified through [Minikube on OSX](https://kubernetes.io/docs/tutorials/stateless-application/hello-minikube/)

    kubectl run acmeair-mongo --image=mongo --port=27017
    kubectl expose deployment/acmeair-mongo --port 27017
    
    kubectl run acmeair-web --image=yanglei99/acmeair-nodejs --port=9080 --env "MONGO_URL=mongodb://acmeair-mongo:27017/acmeair"
    kubectl expose deployment/acmeair-web --type="NodePort" --port 9080
    
    # access the web front
    minikube service acmeair-web
    
You can also use [yaml files] (document/k8s) to create everything at once

    # Monolithic
	kubectl create -f document/k8s/acmeair-web.yaml

    # Micro-Services
	kubectl create -f document/k8s/acmeair-ms.yaml

    # access the web front
    minikube service acmeair-web

### To Build and Run Docker image manually


#### Run MongoDB container

	docker run --name mongo_001 -d -P mongo
	
	docker ps
		to get mapped port of 27017, e.g. 49177 

#### Create a docker image for Acmeair and run Acmeair container

	docker build -t acmeair/web .
	

##### Run Acmeair Container in Monolithic

	docker run -d -P --name acmeair_web_001 --link mongo_001:mongo acmeair/web 
	
	or use the MONGO_URL location e.g.
	
	docker run -d -P --name acmeair_web_002 -e MONGO_URL=mongodb://192.168.59.103:49177/acmeair acmeair/web 
	
		
##### Run Acmeair Containers in Micro-Service

	docker run -d -P --name acmeair_web_003 -e APP_NAME=authservice_app.js --link mongo_001:mongo acmeair/web 
	
	docker ps
		to get mapped port for 9443 , e.g. 49187
		
	docker run -d -P --name acmeair_web_004 -e AUTH_SERVICE=192.168.59.103:49187 --link mongo_001:mongo acmeair/web 

	You can also use the MONGO_URL location as Monolithic case


##### Run Acmeair Containers in Micro-Service with Netflix Hystrix Stream enabled

	docker run -d -P --name acmeair_web_005 -e APP_NAME=authservice_app.js --link mongo_001:mongo acmeair/web 
	
	docker ps
		to get mapped port for 9443 , e.g. 49187
		
	docker run -d -P --name acmeair_web_006 -e AUTH_SERVICE=192.168.59.103:49187 -e enableHystrix=true --link mongo_001:mongo acmeair/web 
	
	You can also use the MONGO_URL location as Monolithic case
	

##### Get application port

	docker ps
		get the mapped port for 9080 to get the application url. e.g. http://192.168.59.103:49178

	If hystrix is enabled, it is available at : http://192.168.59.103:49178/rest/api/hystrix.stream

	
##### Note:

* For Cloudant, you can use CLOUDANT_URL for datasource location


## Run Jmeter workload on Docker 

### Create a docker image for Jmeter workload

[workload docker image](document/workload/Dockerfile)

	docker build -t acmeair/workload document/workload

### Run Jmeter workload against Acme Air runtime

	docker run -i -t -e APP_PORT_9080_TCP_ADDR=<the ip> -e APP_PORT_9080_TCP_PORT=<the port> acmeair/workload
	
	or
	
	docker run -i -t --link acmeair_web_001:app acmeair/workload
	
