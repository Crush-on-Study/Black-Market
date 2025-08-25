#!/usr/bin/env python3
"""
JWT 기능 테스트 스크립트
이 스크립트는 JWT 토큰 생성, 검증, 리프레시 토큰 기능을 테스트합니다.
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from auth_utils import (
    create_access_token,
    create_refresh_token,
    hash_refresh_token,
    verify_access_token,
    verify_refresh_token,
    get_current_user_from_token
)
from datetime import datetime, timedelta

def test_jwt_functionality():
    """JWT 기능 테스트"""
    print("=== JWT 기능 테스트 시작 ===\n")
    
    # 1. 액세스 토큰 생성 테스트
    print("1. 액세스 토큰 생성 테스트")
    user_id = 123
    email = "test@example.com"
    
    access_token = create_access_token(user_id=user_id, email=email)
    print(f"   생성된 액세스 토큰: {access_token[:50]}...")
    
    # 2. 액세스 토큰 검증 테스트
    print("\n2. 액세스 토큰 검증 테스트")
    try:
        payload = verify_access_token(access_token)
        print(f"   토큰 검증 성공: user_id={payload['user_id']}, email={payload['email']}")
        print(f"   토큰 타입: {payload['type']}")
        print(f"   만료 시간: {datetime.fromtimestamp(payload['exp'])}")
    except Exception as e:
        print(f"   토큰 검증 실패: {e}")
    
    # 3. 리프레시 토큰 생성 테스트
    print("\n3. 리프레시 토큰 생성 테스트")
    refresh_token = create_refresh_token()
    print(f"   생성된 리프레시 토큰: {refresh_token}")
    
    # 4. 리프레시 토큰 해시화 테스트
    print("\n4. 리프레시 토큰 해시화 테스트")
    token_hash = hash_refresh_token(refresh_token)
    print(f"   토큰 해시: {token_hash}")
    
    # 5. 리프레시 토큰 검증 테스트
    print("\n5. 리프레시 토큰 검증 테스트")
    try:
        verified_hash = verify_refresh_token(refresh_token)
        print(f"   토큰 검증 성공: {verified_hash}")
        print(f"   해시 일치 여부: {verified_hash == token_hash}")
    except Exception as e:
        print(f"   토큰 검증 실패: {e}")
    
    # 6. 만료된 토큰 테스트 (20분 후 만료)
    print("\n6. 만료된 토큰 테스트")
    expired_token = create_access_token(user_id=user_id, email=email, expire_minutes=0)
    print(f"   만료된 토큰 생성: {expired_token[:50]}...")
    
    try:
        payload = verify_access_token(expired_token)
        print(f"   만료된 토큰 검증 성공 (예상과 다름): {payload}")
    except Exception as e:
        print(f"   만료된 토큰 검증 실패 (예상됨): {e}")
    
    print("\n=== JWT 기능 테스트 완료 ===")

if __name__ == "__main__":
    test_jwt_functionality() 