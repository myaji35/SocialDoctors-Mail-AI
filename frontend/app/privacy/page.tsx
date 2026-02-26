export const metadata = {
  title: '개인정보처리방침 | SocialDoctors',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 text-gray-800">
      <h1 className="text-3xl font-bold mb-2">개인정보처리방침</h1>
      <p className="text-sm text-gray-400 mb-10">최종 수정일: 2026년 02월 26일</p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">1. 수집하는 개인정보 항목</h2>
        <p className="text-gray-600 leading-relaxed">
          당사는 서비스 제공을 위해 다음과 같은 개인정보를 수집합니다.
        </p>
        <ul className="list-disc list-inside mt-2 text-gray-600 space-y-1">
          <li>이름, 이메일 주소</li>
          <li>서비스 이용 기록, 접속 로그</li>
          <li>소셜 미디어 계정 정보 (연동 시)</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">2. 개인정보 수집 및 이용 목적</h2>
        <ul className="list-disc list-inside text-gray-600 space-y-1">
          <li>서비스 제공 및 운영</li>
          <li>회원 관리 및 본인 확인</li>
          <li>서비스 개선 및 신규 서비스 개발</li>
          <li>소셜 미디어 채널 연동 및 콘텐츠 발행 서비스</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">3. 개인정보 보유 및 이용 기간</h2>
        <p className="text-gray-600 leading-relaxed">
          회원 탈퇴 시 또는 수집·이용 목적 달성 시 즉시 파기합니다.
          단, 관련 법령에 의해 보존이 필요한 경우 해당 기간 동안 보관합니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">4. 개인정보의 제3자 제공</h2>
        <p className="text-gray-600 leading-relaxed">
          당사는 이용자의 동의 없이 개인정보를 제3자에게 제공하지 않습니다.
          단, 법령의 규정에 의하거나 수사 목적으로 법령에 정해진 절차에 따라 요청이 있는 경우는 예외로 합니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">5. Facebook 데이터 사용</h2>
        <p className="text-gray-600 leading-relaxed">
          당사는 Meta(Facebook) API를 통해 수집한 페이지 정보 및 액세스 토큰을
          AES-256 암호화하여 안전하게 저장하며, 소셜 미디어 콘텐츠 발행 목적으로만 사용합니다.
          수집된 Facebook 데이터는 제3자에게 제공되지 않습니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">6. 개인정보 보호책임자</h2>
        <p className="text-gray-600 leading-relaxed">
          개인정보 처리에 관한 문의사항은 아래 연락처로 문의해 주세요.
        </p>
        <div className="mt-2 text-gray-600">
          <p>이메일: myaji35@gmail.com</p>
          <p>서비스: SocialDoctors (socialdoctors.io)</p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">7. 개인정보처리방침 변경</h2>
        <p className="text-gray-600 leading-relaxed">
          본 방침은 법령 및 서비스 변경에 따라 수정될 수 있으며,
          변경 시 서비스 내 공지를 통해 안내합니다.
        </p>
      </section>

      <div className="border-t pt-8 text-sm text-gray-400">
        <p>© 2026 SocialDoctors. All rights reserved.</p>
        <p className="mt-1">본 방침은 2026년 02월 26일부터 적용됩니다.</p>
      </div>
    </div>
  );
}
