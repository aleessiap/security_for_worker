# How to generate key files

Key files can be generated with:

```bash
ssh-keygen -t rsa -b 4096 -m PEM -f jwtRS256.key
#Senza pass phrase
openssl rsa -in jwtRS256.key -pubout -outform PEM -out jwtRS256.key.pub
```