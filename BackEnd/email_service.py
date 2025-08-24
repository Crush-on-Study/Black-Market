import smtplib
import random
import string
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

load_dotenv()

class EmailService:
    def __init__(self):
        self.smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
        self.smtp_port = int(os.getenv("SMTP_PORT", "587"))
        self.smtp_username = os.getenv("SMTP_USERNAME", "")
        self.smtp_password = os.getenv("SMTP_PASSWORD", "")
        self.from_email = os.getenv("FROM_EMAIL", self.smtp_username)
        
    def generate_verification_code(self, length=6):
        """6자리 인증 코드 생성"""
        return ''.join(random.choices(string.digits, k=length))
    
    def send_verification_email(self, to_email: str, verification_code: str):
        """이메일 인증 코드 전송"""
        try:
            # 이메일 내용 구성
            subject = "[Black Market] 이메일 인증 코드"
            
            html_body = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                    .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                    .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                    .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
                    .verification-code {{ background: #fff; border: 2px dashed #667eea; padding: 20px; text-align: center; margin: 20px 0; border-radius: 10px; }}
                    .code {{ font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 5px; }}
                    .footer {{ text-align: center; margin-top: 20px; color: #666; font-size: 12px; }}
                    .warning {{ background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1> Black Market</h1>
                        <p>회원가입을 위한 이메일 인증</p>
                    </div>
                    <div class="content">
                        <h2>안녕하세요!</h2>
                        <p>Black Market 회원가입을 위한 이메일 인증 코드입니다.</p>
                        
                        <div class="verification-code">
                            <p>인증 코드</p>
                            <div class="code">{verification_code}</div>
                        </div>
                        
                        <div class="warning">
                            <strong>⚠️ 주의사항</strong>
                            <ul>
                                <li>이 인증 코드는 10분간 유효합니다.</li>
                                <li>인증 코드를 타인과 공유하지 마세요.</li>
                                <li>본인이 요청하지 않은 경우 이 이메일을 무시하세요.</li>
                            </ul>
                        </div>
                        
                        <p>감사합니다.<br>Black Market 팀</p>
                    </div>
                    <div class="footer">
                        <p>이 이메일은 자동으로 발송된 메일입니다. 회신하지 마세요.</p>
                    </div>
                </div>
            </body>
            </html>
            """
            
            # 이메일 메시지 생성
            message = MIMEMultipart("alternative")
            message["Subject"] = subject
            message["From"] = self.from_email
            message["To"] = to_email
            
            # HTML 파트 추가
            html_part = MIMEText(html_body, "html", "utf-8")
            message.attach(html_part)
            
            # SMTP 서버 연결 및 이메일 전송
            if self.smtp_username and self.smtp_password:
                with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                    server.starttls()
                    server.login(self.smtp_username, self.smtp_password)
                    server.send_message(message)
                return True
            else:
                # 개발 환경에서는 콘솔에 출력
                print(f"=== 이메일 인증 코드 (개발 모드) ===")
                print(f"받는 사람: {to_email}")
                print(f"인증 코드: {verification_code}")
                print(f"================================")
                return True
                
        except Exception as e:
            print(f"이메일 전송 실패: {str(e)}")
            return False
    
    def get_expiry_time(self, minutes=10):
        """만료 시간 계산 (기본 10분)"""
        return datetime.now() + timedelta(minutes=minutes)

# 전역 이메일 서비스 인스턴스
email_service = EmailService()