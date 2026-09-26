from fastapi import FastAPI

app = FastAPI(
    title="DevPath Analytics API",
    version="0.1.0"
)


@app.get("/")
def root():
    return {
        "app": "DevPath Analytics",
        "status": "online",
        "version": "0.1.0"
    }


@app.get("/api/health")
def health_check():
    return {
        "status": "ok"
    }