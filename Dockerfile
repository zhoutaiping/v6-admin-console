FROM harbor-jh.bs58i.baishancdnx.com/frontend/bundle-docker:latest

COPY dist /app/dist
COPY server /app/server
RUN npm i express connect-history-api-fallback http-proxy-middleware@0.20.0

WORKDIR /app
EXPOSE 80

CMD ["node", "/app/server/main"] 
