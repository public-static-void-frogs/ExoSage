from fastapi import FastAPI
from app.routers import inference
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title='Backend')
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router=inference.router, prefix='/inference', tags=['inference'])

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "backend.app.main:app",  # шлях до об'єкта FastAPI
        host="0.0.0.0",
        port=8000,
        reload=True,
    )