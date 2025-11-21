@echo off
echo Building Docker image version 4.0.0...
docker build -t gabo9803/cubo-diagnostico:4.0.0 -t gabo9803/cubo-diagnostico:latest .

echo.
echo Pushing version 4.0.0 to Docker Hub...
docker push gabo9803/cubo-diagnostico:4.0.0

echo.
echo Pushing latest tag to Docker Hub...
docker push gabo9803/cubo-diagnostico:latest

echo.
echo Done!

