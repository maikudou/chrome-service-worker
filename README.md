# chrome-service-worker

Test repo for Chrome extensions service worker migration questions

## Test service worker longevity

In my observation it gets killed approximately every 300 seconds in version `89.0.4328.0 (Official Build) canary (x86_64)`

### How to test

Install unpacked extension from the `dist` folder

Inspect web socket

Open this page — https://github.com/maikudou/chrome-service-worker

Inspect page

Observe logs in consoles

#### Expected behaivor

Socket lives untill there are connections to it and to sockets form it

#### Actual behavior

Socket it killed every 300 seconds
