from app.app import create_app

app = create_app()

# Para desenvolvimento local
if __name__ == "__main__":
    app.run(debug=True, port=8000)