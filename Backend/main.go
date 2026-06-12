package main

import (
	"net/http"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/driver/sqlserver"
	"gorm.io/gorm"
)

type Employee struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	FullName  string    `json:"fullName"`
	BirthDate string    `json:"birthDate"`
	Age       int       `json:"age"`
	Address   string    `json:"address"`
	CreatedAt time.Time `json:"createdAt"`
}

var DB *gorm.DB

func initDB() {
   
    db, err := gorm.Open(sqlserver.Open("sqlserver://sa:YourPassword@localhost:1433?database=InterviewDB&encrypt=disable&trustServerCertificate=true"), &gorm.Config{})
    
    if err != nil {
        panic("failed to connect database: " + err.Error())
    }
    
    db.AutoMigrate(&Employee{})
    DB = db
}

func main() {
	initDB()

	r := gin.Default()
	r.Use(cors.Default())

	r.GET("/api/employees", func(c *gin.Context) {
		var employees []Employee
		DB.Find(&employees)
		c.JSON(http.StatusOK, employees)
	})

	r.POST("/api/employees", func(c *gin.Context) {
		var emp Employee
		if err := c.ShouldBindJSON(&emp); err == nil {
			
			emp.Age = time.Now().Year() - 2026 
			DB.Create(&emp)
			c.JSON(http.StatusCreated, emp)
		} else {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		}
	})

	r.Run(":8080")
}