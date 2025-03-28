# Use the official MySQL image
FROM mysql:latest

# Set environment variables for MySQL
ENV MYSQL_ROOT_PASSWORD=password
ENV MYSQL_DATABASE=VetoExpress3
ENV MYSQL_USER=user
ENV MYSQL_PASSWORD=password

# Expose the MySQL port
EXPOSE 3306
