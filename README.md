

# 프로젝트 개요

이 프로젝트는 대용량 트래픽을 처리할 수 있는 티켓팅 백엔드 서비스를 개발하는 것을 목표로 하고 있습니다. NestJS 프레임워크를 사용하여 백엔드를 구현하였으며, PostgreSQL을 데이터베이스로 사용하고 TypeORM을 ORM(Object-Relational Mapping) 라이브러리로 사용하였습니다.

## 프로젝트 구조
![프로젝트 구조 다이어그램](백엔드.png)


## 주요 기능 및 구현 내용

### 티켓 조회 및 예약
- 티켓 조회 시 pagination 처리를 통해 응답 크기를 최적화하고, 티켓 정보를 Redis에 캐싱하여 속도를 향상시켰습니다.
- 도커 컴포즈를 사용하여 각각의 컨테이너를 띄우고 Nginx를 로드 밸런서로 사용하여 웹 컨테이너를 scale out 하였습니다.

### 예약 엔드포인트
- 예약에 필요한 정보를 Redis에 캐싱하여 데이터베이스 접근 횟수를 최소화하고, Redis 트랜잭션 관리를 통해 일관성을 유지하였습니다.
- 웹 컨테이너를 scale out 하고 로드 밸런싱을 수행하였습니다.

### 구매 엔드포인트
- 예약에서 캐싱한 정보를 기반으로 구매를 진행하며, 배치 서버를 통해 캐싱된 구매 정보가 일정 시간 이상 경과 시에만 데이터베이스에 반영되도록 처리하였습니다.
- Redis 트랜잭션 처리를 통해 중복 키 위반을 방지하였으며, RabbitMQ를 이용하여 구매 완료 이메일을 비동기적으로 전송하였습니다.

### 인증 및 권한 관리
- Access Token의 유효기간은 10분으로 설정되어 있고, Refresh Token의 유효기간은 30일입니다.
- Refresh Token은 데이터베이스에 저장되어 stateful하게 관리되며, Access Token은 stateless하게 관리됩니다.
- 컨트롤러에는 토큰이 없을 시 Unauthorized Error를 반환하도록 구현되었으며, 유저의 역할에 따라 인증 가드를 설정하여 권한을 관리하였습니다.
- 사용자 생성(signup) 시 데이터베이스 트랜잭션을 사용하여 롤백 기능을 구현하였습니다.

### 로깅 및 모니터링
- Winston을 사용하여 로그를 수준별로 저장하고, Docker Volume을 활용하여 Filebeat와 연동하여 로그를 수집하였습니다.
- Filebeat가 수집한 로그를 Logstash를 통해 가공한 뒤 Elasticsearch로 전송하고, Kibana를 사용하여 시각화하였습니다.

### API 문서화
- Swagger를 사용하여 Request 및 Response DTO를 문서화하고, 엔드포인트들을 명시하였습니다.

### 예외 처리 및 에러 핸들링
- 프로젝트에서 발생할 수 있는 예외 상황과 에러에 대한 처리 방식을 명시하였습니다. 
- 컨트롤러에서 발생하는 예외는 중앙에서 관리되며, 클라이언트에게 적절한 HTTP 상태 코드와 함께 에러 메시지를 반환합니다.
- 예를 들어, 데이터베이스 쿼리 중에 에러가 발생한 경우, 500 Internal Server Error를 반환하고 로그에 해당 에러를 기록합니다.
- 또한, 클라이언트가 요청한 리소스가 존재하지 않는 경우 404 Not Found를 반환하고 적절한 에러 메시지를 제공합니다.

### 로드 테스트
- Locust의 Faster Client를 활용하여 로드 테스트를 수행하였습니다.

### 사용 기술 스택

- 프레임워크: NestJS
- 데이터베이스: PostgreSQL
- ORM: TypeORM
- 캐싱: Redis
- 컨테이너 관리: Docker, Docker Compose
- 로드 밸런싱: Nginx
- 비동기 메시징: RabbitMQ
- 로그 및 모니터링: Winston, Filebeat, Logstash, Elasticsearch, Kibana
- API 문서화: Swagger
- 로드 테스트: Locust

### 개발 환경 설정

1. Docker 및 Docker Compose 설치
2. 소스코드 클론
3. 환경 변수 설정
4. Docker Compose로 컨테이너 실행

### API 사용 방법

1. Swagger 문서 참조
2. API 호출

### 로드 테스트 수행 방법

1. Locust 설치
2. 로드 테스트 스크립트 작성
3. Locust 실행 및 테스트 수행

### 기여 방법

1. 이슈 등록
2. Fork하여 작업
3. Pull Request 제출



