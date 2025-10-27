# 오렌지pay 웹사이트

빠르고 안전한 신용카드 현금화 서비스를 제공하는 현대적인 반응형 웹사이트입니다. HTML, CSS, JavaScript를 사용하여 제작되었습니다.

## 🌟 주요 기능

- **최고 환율**: 시장 최고 수준의 환율로 신용카드 현금화
- **빠른 처리**: 신청 즉시 처리하여 빠른 현금 지급
- **안전한 거래**: 철저한 보안 시스템으로 개인정보 보호
- **24시간 상담**: 카카오톡과 전화로 언제든지 문의 가능
- **모바일 최적화**: 스마트폰에서도 편리하게 이용 가능

## 📁 프로젝트 구조

```
site/
├── index.html              # 메인 홈페이지
├── about.html              # 회사소개 페이지
├── services.html           # 서비스 페이지 (예정)
├── contact.html            # 문의하기 페이지 (예정)
├── assets/
│   ├── css/
│   │   └── style.css       # 메인 스타일시트
│   ├── js/
│   │   └── script.js       # JavaScript 기능
│   └── images/             # 이미지 파일들 (예정)
├── .github/
│   └── copilot-instructions.md
└── README.md               # 프로젝트 문서
```

## 🚀 시작하기

### 로컬에서 실행하기

1. **프로젝트 클론 또는 다운로드**
   ```bash
   git clone [repository-url]
   cd site
   ```

2. **라이브 서버로 실행**
   - VS Code에서 Live Server 확장을 설치
   - `index.html` 파일을 우클릭하고 "Open with Live Server" 선택
   
   또는 Python을 사용하여:
   ```bash
   python -m http.server 8000
   ```
   
   그런 다음 브라우저에서 `http://localhost:8000`으로 접속

3. **단순히 파일 열기**
   - `index.html` 파일을 브라우저에서 직접 열기

## 📱 페이지 구성

### 1. 홈페이지 (`index.html`)
- **Hero 섹션**: 신용카드 현금화 서비스 메인 배너
- **회사 소개**: 최고 환율, 빠른 처리, 안전한 거래 특징
- **서비스 섹션**: 신용카드 현금화, 급전 서비스 등
- **문의하기**: 전화, 카카오톡 연락처 및 문의 양식

### 2. 회사소개 (`about.html`)
- **회사 개요**: 사명과 비전
- **회사 연혁**: 서비스 시작부터 현재까지의 발전 과정
- **팀 소개**: 금융 전문가들로 구성된 팀
- **핵심 가치**: 신뢰, 신속성, 안전성, 고객 중심

## 🎨 디자인 특징

### 컬러 팔레트
- **Primary**: #2563eb (파란색)
- **Secondary**: #7c3aed (보라색)
- **Success**: #10b981 (초록색)
- **Text**: #333333 (어두운 회색)
- **Background**: #ffffff (흰색), #f8fafc (연한 회색)

### 타이포그래피
- **폰트**: Noto Sans KR (한글), 시스템 폰트 백업
- **크기**: 반응형 타이포그래피 스케일 사용

### 애니메이션
- **스크롤 애니메이션**: Intersection Observer API 사용
- **호버 효과**: CSS transitions
- **페이드인 애니메이션**: keyframes 사용

## 💻 기술 스택

- **HTML5**: 시맨틱 마크업
- **CSS3**: 
  - Flexbox & Grid Layout
  - CSS Custom Properties
  - CSS Animations
  - Mobile-first Media Queries
- **JavaScript ES6+**:
  - DOM 조작
  - Event Listeners
  - Form Validation
  - Intersection Observer API

## 📋 주요 기능

### 네비게이션
- 고정 헤더 (sticky header)
- 모바일 햄버거 메뉴
- 부드러운 스크롤 (smooth scroll)
- 활성 링크 표시

### 인터랙션
- 양식 유효성 검사
- 알림 시스템
- 반응형 버튼 애니메이션
- 카드 호버 효과

### 성능 최적화
- 이미지 최적화 준비
- CSS/JS 최소화 가능
- 웹폰트 최적화
- 모바일 성능 고려

## 🔧 커스터마이징

### 색상 변경
`assets/css/style.css` 파일에서 CSS 변수를 수정하세요:

```css
:root {
  --primary-color: #2563eb;
  --secondary-color: #7c3aed;
  --text-color: #333333;
}
```

### 내용 수정
- 각 HTML 파일에서 텍스트 내용을 직접 수정
- 회사 정보, 서비스 내용, 연락처 등을 업데이트

### 이미지 추가
- `assets/images/` 폴더에 이미지 파일 추가
- HTML에서 이미지 경로 업데이트

## 📱 반응형 브레이크포인트

- **Desktop**: 1024px 이상
- **Tablet**: 768px - 1023px
- **Mobile**: 767px 이하

## 🌐 브라우저 지원

- Chrome (최신 2개 버전)
- Firefox (최신 2개 버전)
- Safari (최신 2개 버전)
- Edge (최신 2개 버전)

## 📝 할 일 목록

- [ ] 서비스 상세 페이지 완성
- [ ] 문의하기 페이지 완성
- [ ] 이미지 자산 추가
- [ ] SEO 메타데이터 최적화
- [ ] 성능 최적화
- [ ] 접근성 개선
- [ ] 다국어 지원 (선택사항)

## 🤝 기여하기

프로젝트 개선에 기여하고 싶으시다면:

1. 이슈 생성 또는 기존 이슈 확인
2. 포크 생성
3. 기능 브랜치 생성 (`git checkout -b feature/새기능`)
4. 변경사항 커밋 (`git commit -m '새 기능 추가'`)
5. 브랜치에 푸시 (`git push origin feature/새기능`)
6. Pull Request 생성

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다. 자세한 내용은 LICENSE 파일을 참조하세요.

## 📞 지원

문의사항이 있으시면 다음으로 연락주세요:
- 전화: 010-5842-536
- 카카오톡: https://pf.kakao.com/_SBFexb/chat
- 운영 시간: 24시간

---

⭐ 이 프로젝트가 도움이 되었다면 스타를 눌러주세요!