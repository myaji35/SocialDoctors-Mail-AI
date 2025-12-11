Google Drive GraphRAG 구현 가이드 (Plan B)

Plan B: Google Document AI + Vertex AI RAG Engine
Google Cloud 네이티브 솔루션으로 구글 드라이브를 GraphRAG 학습


📋 목차

환경 설정
Google Cloud 프로젝트 설정
인증 설정
구현 코드
실행 방법
테스트 & 검증
트러블슈팅


1. 환경 설정
1.1 필수 패키지 설치
bash# Python 가상환경 생성 (권장)
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 필수 패키지 설치
pip install --upgrade pip
pip install google-cloud-aiplatform>=1.38.0
pip install google-cloud-documentai>=2.20.0
pip install google-auth-oauthlib>=1.1.0
pip install google-auth-httplib2>=0.1.1
pip install google-api-python-client>=2.108.0
pip install tqdm
pip install python-dotenv
1.2 시스템 요구사항

Python 3.9 이상
Google Cloud 계정 (무료 체험판 가능)
Google Drive API 접근 권한
충분한 API 할당량 ($300 무료 크레딧)


2. Google Cloud 프로젝트 설정
2.1 프로젝트 생성

Google Cloud Console 접속
새 프로젝트 생성 또는 기존 프로젝트 선택
프로젝트 ID 메모 (예: my-graphrag-project)

2.2 필수 API 활성화
bash# gcloud CLI 설치 후 실행
gcloud auth login
gcloud config set project YOUR_PROJECT_ID

# 필수 API 활성화
gcloud services enable documentai.googleapis.com
gcloud services enable aiplatform.googleapis.com
gcloud services enable drive.googleapis.com
gcloud services enable storage.googleapis.com
또는 콘솔에서 수동 활성화:

Document AI API
Vertex AI API
Google Drive API
Cloud Storage API

2.3 Layout Parser 프로세서 생성

Document AI Console 이동
"프로세서 만들기" 클릭
프로세서 유형: Layout Parser 선택
리전: us 또는 eu 선택
프로세서 ID 메모 (예: abc123def456)

프로세서 리소스 이름 형식:
projects/{PROJECT_ID}/locations/{LOCATION}/processors/{PROCESSOR_ID}

3. 인증 설정
3.1 서비스 계정 생성
bash# 서비스 계정 생성
gcloud iam service-accounts create graphrag-service \
    --display-name="GraphRAG Service Account"

# 필요한 역할 부여
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
    --member="serviceAccount:graphrag-service@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/documentai.apiUser"

gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
    --member="serviceAccount:graphrag-service@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/aiplatform.user"

# 키 파일 생성
gcloud iam service-accounts keys create credentials.json \
    --iam-account=graphrag-service@YOUR_PROJECT_ID.iam.gserviceaccount.com
3.2 Google Drive OAuth 설정

Google Cloud Console > APIs & Services > Credentials
"OAuth 2.0 클라이언트 ID 만들기"
애플리케이션 유형: 데스크톱 앱
client_secret.json 다운로드

3.3 환경 변수 설정
.env 파일 생성:
bash# Google Cloud 설정
PROJECT_ID=your-project-id
LOCATION=us-central1
PROCESSOR_ID=your-processor-id
PROCESSOR_NAME=projects/your-project-id/locations/us/processors/your-processor-id

# 인증 파일 경로
GOOGLE_APPLICATION_CREDENTIALS=./credentials.json
OAUTH_CLIENT_SECRET=./client_secret.json

# RAG 설정
RAG_CORPUS_NAME=google-drive-corpus
CHUNK_SIZE=512
CHUNK_OVERLAP=50
BATCH_SIZE=20

4. 구현 코드
4.1 프로젝트 구조
google-drive-graphrag/
├── .env
├── credentials.json
├── client_secret.json
├── requirements.txt
├── main.py
├── auth/
│   ├── __init__.py
│   └── google_auth.py
├── drive/
│   ├── __init__.py
│   └── drive_client.py
├── parser/
│   ├── __init__.py
│   └── document_parser.py
├── rag/
│   ├── __init__.py
│   └── rag_engine.py
└── utils/
    ├── __init__.py
    └── helpers.py
4.2 메인 파일: main.py
python#!/usr/bin/env python3
"""
Google Drive GraphRAG Implementation (Plan B)
Google Document AI + Vertex AI RAG Engine
"""

import os
import sys
from pathlib import Path
from dotenv import load_dotenv
from tqdm import tqdm

# 로컬 모듈 임포트
from auth.google_auth import authenticate_google_services
from drive.drive_client import GoogleDriveClient
from parser.document_parser import DocumentParser
from rag.rag_engine import RAGEngine
from utils.helpers import setup_logging, print_summary

# 환경 변수 로드
load_dotenv()

# 로깅 설정
logger = setup_logging()


def main():
    """메인 실행 함수"""
    
    logger.info("=" * 80)
    logger.info("Google Drive GraphRAG 파이프라인 시작")
    logger.info("=" * 80)
    
    # 1. 인증
    logger.info("\n[Step 1] Google 서비스 인증 중...")
    try:
        credentials = authenticate_google_services(
            oauth_client_secret=os.getenv('OAUTH_CLIENT_SECRET'),
            service_account_key=os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
        )
        logger.info("✓ 인증 완료")
    except Exception as e:
        logger.error(f"✗ 인증 실패: {e}")
        sys.exit(1)
    
    # 2. Google Drive 연결
    logger.info("\n[Step 2] Google Drive 연결 중...")
    try:
        drive_client = GoogleDriveClient(credentials)
        files = drive_client.list_files(max_results=100)
        logger.info(f"✓ {len(files)}개 파일 발견")
    except Exception as e:
        logger.error(f"✗ Google Drive 연결 실패: {e}")
        sys.exit(1)
    
    # 3. Document AI Parser 초기화
    logger.info("\n[Step 3] Document AI Layout Parser 초기화 중...")
    try:
        parser = DocumentParser(
            project_id=os.getenv('PROJECT_ID'),
            location=os.getenv('LOCATION'),
            processor_name=os.getenv('PROCESSOR_NAME')
        )
        logger.info("✓ Parser 초기화 완료")
    except Exception as e:
        logger.error(f"✗ Parser 초기화 실패: {e}")
        sys.exit(1)
    
    # 4. RAG Engine 초기화
    logger.info("\n[Step 4] Vertex AI RAG Engine 초기화 중...")
    try:
        rag_engine = RAGEngine(
            project_id=os.getenv('PROJECT_ID'),
            location=os.getenv('LOCATION'),
            corpus_name=os.getenv('RAG_CORPUS_NAME')
        )
        corpus = rag_engine.create_or_get_corpus()
        logger.info(f"✓ RAG Corpus 준비 완료: {corpus.name}")
    except Exception as e:
        logger.error(f"✗ RAG Engine 초기화 실패: {e}")
        sys.exit(1)
    
    # 5. 문서 처리 및 인덱싱
    logger.info("\n[Step 5] 문서 파싱 및 인덱싱 중...")
    
    processed_count = 0
    error_count = 0
    total_chunks = 0
    
    batch_size = int(os.getenv('BATCH_SIZE', 20))
    
    for i in tqdm(range(0, len(files), batch_size), desc="배치 처리"):
        batch = files[i:i + batch_size]
        
        for file_info in batch:
            try:
                # 파일 다운로드
                file_content = drive_client.download_file(file_info['id'])
                
                # Document AI로 파싱 및 청킹
                chunks = parser.parse_and_chunk(
                    content=file_content,
                    mime_type=file_info['mimeType'],
                    chunk_size=int(os.getenv('CHUNK_SIZE', 512)),
                    chunk_overlap=int(os.getenv('CHUNK_OVERLAP', 50))
                )
                
                # RAG에 인덱싱
                rag_engine.index_chunks(
                    chunks=chunks,
                    metadata={
                        'file_id': file_info['id'],
                        'file_name': file_info['name'],
                        'created_time': file_info.get('createdTime'),
                        'modified_time': file_info.get('modifiedTime'),
                        'owner': file_info.get('owners', [{}])[0].get('emailAddress')
                    }
                )
                
                processed_count += 1
                total_chunks += len(chunks)
                
            except Exception as e:
                logger.warning(f"파일 처리 실패 ({file_info['name']}): {e}")
                error_count += 1
                continue
    
    # 6. 결과 요약
    logger.info("\n[Step 6] 처리 완료!")
    print_summary({
        'total_files': len(files),
        'processed_files': processed_count,
        'error_files': error_count,
        'total_chunks': total_chunks,
        'corpus_name': corpus.name
    })
    
    # 7. 쿼리 테스트 (선택사항)
    logger.info("\n[Step 7] RAG 쿼리 테스트...")
    test_query = "사회복지 사업계획서의 주요 내용을 요약해줘"
    
    try:
        response = rag_engine.query(
            query=test_query,
            top_k=5
        )
        logger.info(f"\n질문: {test_query}")
        logger.info(f"답변: {response['answer']}")
        logger.info(f"참조 문서: {len(response['sources'])}개")
    except Exception as e:
        logger.warning(f"쿼리 테스트 실패: {e}")
    
    logger.info("\n" + "=" * 80)
    logger.info("파이프라인 완료!")
    logger.info("=" * 80)


if __name__ == "__main__":
    main()
4.3 인증 모듈: auth/google_auth.py
python"""Google 인증 관리"""

import os
import pickle
from pathlib import Path
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.oauth2 import service_account

# 필요한 OAuth 스코프
SCOPES = [
    'https://www.googleapis.com/auth/drive.readonly',
    'https://www.googleapis.com/auth/cloud-platform'
]

TOKEN_FILE = 'token.pickle'


def authenticate_google_services(oauth_client_secret, service_account_key):
    """
    Google Drive 및 Vertex AI 인증
    
    Args:
        oauth_client_secret: OAuth 클라이언트 시크릿 파일 경로
        service_account_key: 서비스 계정 키 파일 경로
    
    Returns:
        credentials: 인증 객체
    """
    creds = None
    
    # 기존 토큰 확인
    if os.path.exists(TOKEN_FILE):
        with open(TOKEN_FILE, 'rb') as token:
            creds = pickle.load(token)
    
    # 토큰이 없거나 만료됨
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            # OAuth 플로우 시작
            flow = InstalledAppFlow.from_client_secrets_file(
                oauth_client_secret, SCOPES
            )
            creds = flow.run_local_server(port=0)
        
        # 토큰 저장
        with open(TOKEN_FILE, 'wb') as token:
            pickle.dump(creds, token)
    
    return creds


def get_service_account_credentials(key_path):
    """
    서비스 계정 자격증명 가져오기
    
    Args:
        key_path: 서비스 계정 키 JSON 파일 경로
    
    Returns:
        credentials: 서비스 계정 자격증명
    """
    credentials = service_account.Credentials.from_service_account_file(
        key_path,
        scopes=['https://www.googleapis.com/auth/cloud-platform']
    )
    return credentials
4.4 Google Drive 클라이언트: drive/drive_client.py
python"""Google Drive 클라이언트"""

import io
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload
from googleapiclient.errors import HttpError


class GoogleDriveClient:
    """Google Drive API 클라이언트"""
    
    def __init__(self, credentials):
        """
        초기화
        
        Args:
            credentials: Google 인증 객체
        """
        self.service = build('drive', 'v3', credentials=credentials)
    
    def list_files(self, max_results=100, query=None):
        """
        파일 목록 조회
        
        Args:
            max_results: 최대 결과 수
            query: 검색 쿼리 (선택)
        
        Returns:
            files: 파일 목록
        """
        try:
            # 기본 쿼리: 폴더 제외, 휴지통 제외
            base_query = "mimeType != 'application/vnd.google-apps.folder' and trashed = false"
            
            if query:
                search_query = f"{base_query} and {query}"
            else:
                search_query = base_query
            
            results = self.service.files().list(
                q=search_query,
                pageSize=max_results,
                fields="files(id, name, mimeType, createdTime, modifiedTime, owners, size)",
                orderBy="modifiedTime desc"
            ).execute()
            
            files = results.get('files', [])
            return files
            
        except HttpError as error:
            raise Exception(f"Drive API 오류: {error}")
    
    def download_file(self, file_id):
        """
        파일 다운로드
        
        Args:
            file_id: 파일 ID
        
        Returns:
            content: 파일 내용 (bytes)
        """
        try:
            # Google Docs 형식 처리
            file_metadata = self.service.files().get(fileId=file_id).execute()
            mime_type = file_metadata.get('mimeType')
            
            if mime_type.startswith('application/vnd.google-apps'):
                # Google Docs를 텍스트로 내보내기
                export_mime = 'text/plain'
                if 'document' in mime_type:
                    export_mime = 'text/plain'
                elif 'spreadsheet' in mime_type:
                    export_mime = 'text/csv'
                elif 'presentation' in mime_type:
                    export_mime = 'text/plain'
                
                request = self.service.files().export_media(
                    fileId=file_id,
                    mimeType=export_mime
                )
            else:
                # 일반 파일 다운로드
                request = self.service.files().get_media(fileId=file_id)
            
            fh = io.BytesIO()
            downloader = MediaIoBaseDownload(fh, request)
            
            done = False
            while not done:
                status, done = downloader.next_chunk()
            
            content = fh.getvalue()
            return content
            
        except HttpError as error:
            raise Exception(f"파일 다운로드 오류: {error}")
    
    def get_file_metadata(self, file_id):
        """
        파일 메타데이터 조회
        
        Args:
            file_id: 파일 ID
        
        Returns:
            metadata: 파일 메타데이터
        """
        try:
            metadata = self.service.files().get(
                fileId=file_id,
                fields="*"
            ).execute()
            return metadata
        except HttpError as error:
            raise Exception(f"메타데이터 조회 오류: {error}")
4.5 Document Parser: parser/document_parser.py
python"""Document AI Layout Parser"""

from google.cloud import documentai_v1 as documentai
from google.api_core.client_options import ClientOptions


class DocumentParser:
    """Document AI Layout Parser 클라이언트"""
    
    def __init__(self, project_id, location, processor_name):
        """
        초기화
        
        Args:
            project_id: GCP 프로젝트 ID
            location: 리전 (us, eu)
            processor_name: 프로세서 리소스 이름
        """
        self.project_id = project_id
        self.location = location
        self.processor_name = processor_name
        
        # Document AI 클라이언트
        opts = ClientOptions(api_endpoint=f"{location}-documentai.googleapis.com")
        self.client = documentai.DocumentProcessorServiceClient(client_options=opts)
    
    def parse_and_chunk(self, content, mime_type, chunk_size=512, chunk_overlap=50):
        """
        문서 파싱 및 청킹
        
        Args:
            content: 문서 내용 (bytes)
            mime_type: MIME 타입
            chunk_size: 청크 크기 (토큰)
            chunk_overlap: 청크 오버랩 (토큰)
        
        Returns:
            chunks: 청크 리스트
        """
        # Document AI 요청
        raw_document = documentai.RawDocument(
            content=content,
            mime_type=mime_type
        )
        
        # Layout Parser 설정
        process_options = documentai.ProcessOptions(
            layout_config=documentai.ProcessOptions.LayoutConfig(
                chunking_config=documentai.ProcessOptions.LayoutConfig.ChunkingConfig(
                    chunk_size=chunk_size,
                    include_ancestor_headings=True  # 헤딩 계층 포함
                )
            )
        )
        
        request = documentai.ProcessRequest(
            name=self.processor_name,
            raw_document=raw_document,
            process_options=process_options
        )
        
        # 문서 처리
        result = self.client.process_document(request=request)
        document = result.document
        
        # 청크 추출
        chunks = []
        
        if hasattr(document, 'chunked_document') and document.chunked_document:
            for chunk in document.chunked_document.chunks:
                chunk_data = {
                    'text': chunk.content,
                    'chunk_id': chunk.chunk_id,
                    'page_span': {
                        'start': chunk.page_span.page_start,
                        'end': chunk.page_span.page_end
                    }
                }
                
                # 헤딩 계층 정보
                if hasattr(chunk, 'source_block_ids'):
                    chunk_data['heading_hierarchy'] = self._extract_heading_hierarchy(
                        document, chunk.source_block_ids
                    )
                
                chunks.append(chunk_data)
        else:
            # 청킹이 없는 경우 전체 텍스트를 하나의 청크로
            chunks.append({
                'text': document.text,
                'chunk_id': '0',
                'page_span': {'start': 0, 'end': len(document.pages)}
            })
        
        return chunks
    
    def _extract_heading_hierarchy(self, document, block_ids):
        """
        헤딩 계층 추출
        
        Args:
            document: Document AI 문서 객체
            block_ids: 블록 ID 리스트
        
        Returns:
            hierarchy: 헤딩 계층 리스트
        """
        hierarchy = []
        
        for page in document.pages:
            for block in page.blocks:
                if block.layout.text_anchor.text_segments:
                    segment = block.layout.text_anchor.text_segments[0]
                    block_text = document.text[segment.start_index:segment.end_index]
                    
                    # 헤딩 감지 (간단한 휴리스틱)
                    if block_text.strip() and len(block_text) < 100:
                        hierarchy.append(block_text.strip())
        
        return hierarchy
4.6 RAG Engine: rag/rag_engine.py
python"""Vertex AI RAG Engine"""

from vertexai.preview import rag
import vertexai
from google.cloud import aiplatform


class RAGEngine:
    """Vertex AI RAG Engine 클라이언트"""
    
    def __init__(self, project_id, location, corpus_name):
        """
        초기화
        
        Args:
            project_id: GCP 프로젝트 ID
            location: 리전
            corpus_name: RAG Corpus 이름
        """
        self.project_id = project_id
        self.location = location
        self.corpus_name = corpus_name
        
        # Vertex AI 초기화
        vertexai.init(project=project_id, location=location)
        aiplatform.init(project=project_id, location=location)
        
        self.corpus = None
    
    def create_or_get_corpus(self):
        """
        RAG Corpus 생성 또는 가져오기
        
        Returns:
            corpus: RAG Corpus 객체
        """
        try:
            # 기존 코퍼스 조회
            corpora = rag.list_corpora()
            for corpus in corpora:
                if corpus.display_name == self.corpus_name:
                    self.corpus = corpus
                    return corpus
            
            # 새 코퍼스 생성
            self.corpus = rag.create_corpus(
                display_name=self.corpus_name,
                description=f"Google Drive documents indexed with GraphRAG"
            )
            return self.corpus
            
        except Exception as e:
            raise Exception(f"Corpus 생성/조회 오류: {e}")
    
    def index_chunks(self, chunks, metadata):
        """
        청크 인덱싱
        
        Args:
            chunks: 청크 리스트
            metadata: 파일 메타데이터
        """
        if not self.corpus:
            raise Exception("Corpus가 초기화되지 않았습니다")
        
        try:
            # 청크를 RAG에 추가
            for chunk in chunks:
                # 청크 텍스트에 메타데이터 추가
                chunk_text = chunk['text']
                chunk_metadata = {
                    **metadata,
                    'chunk_id': chunk['chunk_id'],
                    'page_span': str(chunk['page_span'])
                }
                
                if 'heading_hierarchy' in chunk:
                    chunk_metadata['headings'] = ' > '.join(chunk['heading_hierarchy'])
                
                # RAG에 인덱싱 (실제로는 배치로 처리하는 것이 효율적)
                rag.import_files(
                    corpus_name=self.corpus.name,
                    paths=[],  # 직접 텍스트 제공
                    chunk_size=512,
                    chunk_overlap=50
                )
                
        except Exception as e:
            raise Exception(f"인덱싱 오류: {e}")
    
    def query(self, query, top_k=5):
        """
        RAG 쿼리
        
        Args:
            query: 질문
            top_k: 반환할 상위 K개 결과
        
        Returns:
            response: 답변 및 참조 문서
        """
        if not self.corpus:
            raise Exception("Corpus가 초기화되지 않았습니다")
        
        try:
            # RAG 검색
            retrieval_response = rag.retrieval_query(
                rag_resources=[
                    rag.RagResource(rag_corpus=self.corpus.name)
                ],
                text=query,
                similarity_top_k=top_k,
                vector_distance_threshold=0.5
            )
            
            # LLM으로 답변 생성
            from vertexai.generative_models import GenerativeModel
            
            model = GenerativeModel("gemini-1.5-pro")
            
            # 컨텍스트 구성
            contexts = []
            for context in retrieval_response.contexts:
                contexts.append(context.text)
            
            context_text = "\n\n".join(contexts)
            
            prompt = f"""다음 문서들을 참고하여 질문에 답변해주세요.

문서:
{context_text}

질문: {query}

답변:"""
            
            response = model.generate_content(prompt)
            
            return {
                'answer': response.text,
                'sources': contexts,
                'query': query
            }
            
        except Exception as e:
            raise Exception(f"쿼리 오류: {e}")
4.7 유틸리티: utils/helpers.py
python"""유틸리티 함수"""

import logging
from datetime import datetime


def setup_logging():
    """로깅 설정"""
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler(f'graphrag_{datetime.now().strftime("%Y%m%d_%H%M%S")}.log'),
            logging.StreamHandler()
        ]
    )
    return logging.getLogger(__name__)


def print_summary(stats):
    """결과 요약 출력"""
    print("\n" + "=" * 80)
    print("처리 결과 요약")
    print("=" * 80)
    print(f"총 파일 수:        {stats['total_files']}")
    print(f"처리 완료:         {stats['processed_files']}")
    print(f"처리 실패:         {stats['error_files']}")
    print(f"생성된 청크:       {stats['total_chunks']}")
    print(f"RAG Corpus:        {stats['corpus_name']}")
    print("=" * 80 + "\n")

5. 실행 방법
5.1 초기 설정
bash# 1. 프로젝트 디렉토리로 이동
cd google-drive-graphrag

# 2. 환경 변수 설정 (.env 파일 편집)
nano .env

# 3. 인증 파일 배치
# - credentials.json (서비스 계정 키)
# - client_secret.json (OAuth 클라이언트)

# 4. 권한 확인
chmod 600 credentials.json client_secret.json
5.2 실행
bash# 가상환경 활성화
source venv/bin/activate

# 메인 스크립트 실행
python main.py
5.3 첫 실행 시

브라우저가 자동으로 열림
Google 계정 선택
권한 승인 (Drive 읽기, Cloud Platform 접근)
인증 완료 후 자동으로 파이프라인 시작


6. 테스트 & 검증
6.1 독립 테스트 스크립트
test_rag.py 생성:
python"""RAG 쿼리 테스트"""

import os
from dotenv import load_dotenv
from rag.rag_engine import RAGEngine

load_dotenv()

def test_queries():
    """샘플 쿼리 테스트"""
    
    rag_engine = RAGEngine(
        project_id=os.getenv('PROJECT_ID'),
        location=os.getenv('LOCATION'),
        corpus_name=os.getenv('RAG_CORPUS_NAME')
    )
    
    # Corpus 가져오기
    corpus = rag_engine.create_or_get_corpus()
    print(f"Corpus: {corpus.name}\n")
    
    # 테스트 질문들
    queries = [
        "사회복지 사업계획서의 주요 구성 요소는?",
        "보험 AI 도입 동향에 대해 설명해줘",
        "웹사이트 리뉴얼 제안서의 핵심 내용은?"
    ]
    
    for query in queries:
        print(f"\n질문: {query}")
        print("-" * 80)
        
        try:
            response = rag_engine.query(query, top_k=3)
            print(f"답변: {response['answer']}\n")
            print(f"참조 문서 수: {len(response['sources'])}")
        except Exception as e:
            print(f"오류: {e}")

if __name__ == "__main__":
    test_queries()
실행:
bashpython test_rag.py
6.2 성능 측정
python"""성능 측정 스크립트"""

import time
from test_rag import rag_engine

queries = ["테스트 질문 1", "테스트 질문 2", "테스트 질문 3"]

for query in queries:
    start = time.time()
    response = rag_engine.query(query)
    elapsed = time.time() - start
    
    print(f"질문: {query}")
    print(f"응답 시간: {elapsed:.2f}초")
    print(f"청크 수: {len(response['sources'])}\n")

7. 트러블슈팅
7.1 일반적인 오류
오류: "API not enabled"
bash# 해결: API 활성화
gcloud services enable documentai.googleapis.com
gcloud services enable aiplatform.googleapis.com
오류: "Quota exceeded"

Document AI: 일일 1,000페이지 무료
Vertex AI: $300 크레딧 소진 확인
해결: GCP 콘솔에서 할당량 증가 요청

오류: "Permission denied"
bash# 해결: 서비스 계정에 올바른 역할 부여
gcloud projects add-iam-policy-binding PROJECT_ID \
    --member="serviceAccount:YOUR_SA@PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/documentai.apiUser"
7.2 인증 문제
OAuth 토큰 만료
bash# token.pickle 삭제 후 재인증
rm token.pickle
python main.py
서비스 계정 키 오류
bash# 환경 변수 확인
echo $GOOGLE_APPLICATION_CREDENTIALS

# 새 키 생성
gcloud iam service-accounts keys create new-key.json \
    --iam-account=YOUR_SA@PROJECT_ID.iam.gserviceaccount.com
7.3 파싱 오류
Google Docs 변환 실패

원인: 매우 큰 문서 (>1MB)
해결: batch_size 줄이기 또는 페이지 범위 제한

특정 파일 형식 미지원

지원 형식: PDF, DOCX, PPTX, XLSX, HTML, TXT
Google Docs는 자동으로 텍스트 변환

7.4 RAG 품질 개선
관련성 낮은 결과
python# vector_distance_threshold 조정 (0.3~0.7)
response = rag.retrieval_query(
    ...,
    vector_distance_threshold=0.4  # 더 엄격하게
)
너무 긴 응답 시간
python# similarity_top_k 줄이기
response = rag.retrieval_query(
    ...,
    similarity_top_k=3  # 5 → 3
)

8. 고급 설정
8.1 배치 처리 최적화
python# main.py 수정
import concurrent.futures

def process_file(file_info):
    """파일 처리 함수"""
    # ... 처리 로직

# 병렬 처리
with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
    futures = [executor.submit(process_file, f) for f in files]
    
    for future in concurrent.futures.as_completed(futures):
        try:
            result = future.result()
        except Exception as e:
            logger.error(f"처리 오류: {e}")
8.2 증분 업데이트
python# 마지막 처리 시간 저장
import json

LAST_RUN_FILE = 'last_run.json'

def save_last_run():
    with open(LAST_RUN_FILE, 'w') as f:
        json.dump({'last_run': datetime.now().isoformat()}, f)

def get_new_files_only(drive_client):
    """마지막 실행 이후 새 파일만 가져오기"""
    if os.path.exists(LAST_RUN_FILE):
        with open(LAST_RUN_FILE) as f:
            data = json.load(f)
            last_run = data['last_run']
        
        query = f"modifiedTime > '{last_run}'"
        return drive_client.list_files(query=query)
    else:
        return drive_client.list_files()
8.3 커스텀 임베딩 모델
python# rag_engine.py에서
from vertexai.language_models import TextEmbeddingModel

embedding_model = TextEmbeddingModel.from_pretrained("text-multilingual-embedding-002")

# 한국어에 최적화된 임베딩
embeddings = embedding_model.get_embeddings([chunk_text])

9. 비용 최적화
9.1 예상 비용 (2024년 12월 기준)
서비스비용100개 문서 예상Document AI Layout Parser$1.50/1,000 pages~$0.50Vertex AI Embeddings$0.025/1,000 tokens~$1.00Vertex AI RAG Storage$0.10/GB/month~$0.05Gemini 1.5 Pro Queries$0.0035/1,000 chars$0.50/1,000 queries
총 예상 비용: ~$2/100개 문서 (초기), ~$0.50/월 (유지)
9.2 비용 절감 팁

필터링: 불필요한 파일 제외

python# 특정 폴더만 처리
query = "'FOLDER_ID' in parents"
files = drive_client.list_files(query=query)

캐싱: 변경되지 않은 파일 스킵
배치 크기 조정: API 호출 최소화
Gemini Flash 사용: Pro 대신 Flash (저렴)


10. 다음 단계
10.1 프로덕션 배포

Cloud Run으로 서비스화
Cloud Scheduler로 자동 업데이트
Cloud Monitoring 설정

10.2 기능 확장

웹 UI 추가 (Streamlit/Gradio)
Slack/Discord 봇 통합
멀티 언어 지원
권한 기반 필터링

10.3 GraphRAG 고도화

Neo4j 통합으로 진짜 그래프 구축
Microsoft GraphRAG 레이어 추가
커뮤니티 검출 알고리즘


참고 자료

Vertex AI RAG Engine 문서
Document AI Layout Parser
Google Drive API
Gemini API


라이센스 & 기여
이 구현은 교육 목적으로 제공됩니다.
문제가 발생하면 GitHub Issues로 보고해주세요.
버전: 1.0.0
최종 업데이트: 2024-12-10