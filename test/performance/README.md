# Performance Tests

These tests use [k6] and the experimental browser support.

## Steps

1. Start a server using `NODE_ENV=development API_BASE_URL=http://127.0.0.1:8010/ node src/app.js`
2. Start mock api using `yarn run mocks:imposter`
3. Run perf tests using `K6_BROWSER_ENABLED=true k6 run --vus 10 --duration 30s browser.js`

This will produce an output of:

```
     browser_dom_content_loaded.............................: avg=27.46ms  min=21µs     med=22.22ms  max=164.62ms p(90)=60.45ms  p(95)=81.05ms
     browser_first_paint....................................: avg=40.28ms  min=10.76ms  med=31.42ms  max=152.64ms p(90)=70.19ms  p(95)=86.36ms
     browser_loaded.........................................: avg=36.93ms  min=112µs    med=28.09ms  max=219.14ms p(90)=85.83ms  p(95)=110.81ms
     data_received..........................................: 166 MB 5.2 MB/s
     data_sent..............................................: 2.4 MB 76 kB/s
     http_req_connecting....................................: avg=701ns    min=0s       med=0s       max=1ms      p(90)=0s       p(95)=0s
     http_req_duration......................................: avg=28.13ms  min=15µs     med=83µs     max=261.98ms p(90)=101.82ms p(95)=128ms
     http_req_receiving.....................................: avg=33.86ms  min=0s       med=10ms     max=259ms    p(90)=102ms    p(95)=127ms
     http_req_sending.......................................: avg=0s       min=0s       med=0s       max=0s       p(90)=0s       p(95)=0s
     http_req_tls_handshaking...............................: avg=0s       min=0s       med=0s       max=0s       p(90)=0s       p(95)=0s
     http_reqs..............................................: 5700   179.899952/s
     iteration_duration.....................................: avg=2.09s    min=1.83s    med=2.05s    max=2.63s    p(90)=2.25s    p(95)=2.37s
     iterations.............................................: 150    4.734209/s
     vus....................................................: 9      min=9        max=10
     vus_max................................................: 10     min=10       max=10
     webvital_cumulative_layout_shift.......................: avg=0.012034 min=0        med=0        max=0.175314 p(90)=0.000015 p(95)=0.174799
     webvital_cumulative_layout_shift_good..................: 419    13.224225/s
     webvital_cumulative_layout_shift_needs_improvement.....: 31     0.978403/s
     webvital_first_contentful_paint........................: avg=275.09ms min=133.77ms med=253.81ms max=548.56ms p(90)=398.79ms p(95)=431.18ms
     webvital_first_contentful_paint_good...................: 600    18.936837/s
     webvital_first_input_delay.............................: avg=514.87µs min=79.99µs  med=357.5µs  max=22.2ms   p(90)=709.99µs p(95)=1.01ms
     webvital_first_input_delay_good........................: 450    14.202628/s
     webvital_interaction_to_next_paint.....................: avg=45.81ms  min=0s       med=16ms     max=216ms    p(90)=200ms    p(95)=200ms
     webvital_interaction_to_next_paint_good................: 439    13.855452/s
     webvital_interaction_to_next_paint_needs_improvement...: 11     0.347175/s
     webvital_largest_content_paint.........................: avg=295.18ms min=133.77ms med=269.64ms max=596.39ms p(90)=439.11ms p(95)=475.15ms
     webvital_largest_content_paint_good....................: 448    14.139505/s
     webvital_time_to_first_byte............................: avg=225.06ms min=107.3ms  med=212.4ms  max=472.61ms p(90)=315.61ms p(95)=332.88ms
     webvital_time_to_first_byte_good.......................: 600    18.936837/s
```

Note: The above tests were run with:

- A random laptop with many applications running
- `NODE_ENV=development`
- Express `logging=trace`
- Imposter `logging=trace`

So those example results are not indicative of real performance
