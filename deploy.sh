#/bin/sh

docker login -u ${DOCKERHUB_USERNAME} -p ${DOCKERHUB_PASSWORD}
sudo mkdir -p /var/lib/app/${BITBUCKET_REPO_SLUG}
sudo chown -R ${DEFAULT_SSH_USER}:${DEFAULT_SSH_USER} /var/lib/app/${BITBUCKET_REPO_SLUG}
mv docker-compose.yml /var/lib/app/${BITBUCKET_REPO_SLUG}
docker compose -f /var/lib/app/${BITBUCKET_REPO_SLUG}/docker-compose.yml down
docker compose -f /var/lib/app/${BITBUCKET_REPO_SLUG}/docker-compose.yml pull
docker compose -f /var/lib/app/${BITBUCKET_REPO_SLUG}/docker-compose.yml up -d
docker image prune -a -f