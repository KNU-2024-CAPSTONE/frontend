REPOSITORY=/home/ubuntu/repository
PROJECT_NAME=frontend

echo "> frontend 배포 시작"


echo "> frontend Repository로 이동"
cd $REPOSITORY/$PROJECT_NAME

# main 브랜치의 최신 내용 받기
echo "> Git Pull"
git pull origin main

echo "> npm run build 실행"
npm run build

echo "> 정적 파일 복사"
sudo cp -r build/* /var/www/html/

echo "> nginx 재시작"
sudo systemctl restart nginx
