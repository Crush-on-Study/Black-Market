from mangum import Mangum
from app import app

# Lambda handler
handler = Mangum(app, lifespan="off")