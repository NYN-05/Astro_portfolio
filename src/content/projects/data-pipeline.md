---
title: 'Real-time Data Pipeline'
description: 'High-throughput data processing pipeline for ingesting, transforming, and analyzing streaming event data.'
problem: 'Processing millions of events per day with sub-second latency requirements for analytics dashboards.'
approach: 'Designed a Go-based pipeline using Kafka for ingestion, Redis for caching, and ClickHouse for analytical queries. Implemented exactly-once semantics with idempotent consumers.'
technologies:
  - Go
  - Apache Kafka
  - Redis
  - ClickHouse
  - Prometheus
  - Grafana
  - Kubernetes
contributions:
  - Built custom Kafka consumer group with automatic rebalancing
  - Implemented schema registry integration for Avro serialization
  - Designed horizontal scaling strategy handling 10x traffic spikes
results: 'Achieved 99.9th percentile latency under 200ms at 500k events/second.'
repoUrl: 'https://github.com/example/data-pipeline'
status: 'completed'
featured: true
startDate: '2022-01-15'
endDate: '2022-08-30'
image: 'https://picsum.photos/seed/data-pipeline/800/450.jpg'
imageAlt: 'Data pipeline architecture diagram showing Kafka, Redis, and ClickHouse components'
---