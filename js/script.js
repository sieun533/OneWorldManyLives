// 씬 & 플레이어 변수 지정
let player = document.querySelector('.player'); // 플레이어
let screen = document.querySelector('.Screen'); // 게임 화면
let interactPanel = document.querySelector('.interact-panel'); // 상호작용 패널
let step = 5; // 보폭
let chapter = 1; // 챕터 설정
let isClearZone = false; // 클리어 구역에 있는지 확인

// 룸에 배치된 아이템 변수 지정
let roomCane = document.querySelector('.room_cane');
let roomPhone = document.querySelector('.room_phone');
let roomAudible = document.querySelector('.room_audible');
let roomAirpods = document.querySelector('.room_airpods');

// 인벤토리 변수 지정
let inventory = []; 
let slots = document.querySelectorAll('.slot');
const maxInventorySize = 4;

// 챕터별 미션 완료 상태
let chapter1Clear = false; // 아이템 4개 모두 수집 여부
let chapter3Clear = false; // 3개 퀴즈 완료 여부
let chapter5Clear = false; // 휴대폰 스크롤 미션 완료 여부

// 게임 오프닝
function GameStart() {
    const opening = document.querySelector('.opening');

    console.log('게임 시작');

    setTimeout(() => { // 5초 후에 화면 숨김
        opening.style.display = 'none';
    }, 5000);
}

// 게임 엔딩
function GameEnd() {
    chapter = 6; // 배경음악 추가하기 위해서 챕터 6으로 설정
    const ending = document.querySelector('.ending'); // 엔딩화면
    const copyRight = document.querySelector('.copyright') // 카피라이트

    ending.style.display = 'block'; // 엔딩 화면 출력
    console.log('게임 종료');

    playBGM(); // 엔딩 음악 재생

    setTimeout(() => { // 7.5초 후에 카피라이트 표시
        console.log('마지막 문장 표시');
        copyRight.classList.add('copyAnim'); // 카피라이트 화면 표시 애니메이션 적용
    }, 7500);
}

// 배경음악 관리
const chapterBGM = document.querySelectorAll('.chapter-bgm');

function playBGM() {

    chapterBGM.forEach(audio => { // 모든 오디오 
        audio.pause(); // 일시정지
        audio.muted = true; // 뮤트 활성화
    });

    currentBGM = document.querySelector(`.chapter_${chapter} .chapter-bgm`);
    currentBGM.muted = false; // 뮤트 비활성화
    currentBGM.play(); // 챕터에 해당하는 배경음만 재생
}

// 게임 시작 시 첫 번째 챕터 미션 설정
document.addEventListener('DOMContentLoaded', () => {
    upDateMission();
});

// 미션버튼 변수 지정
let missionBtn = document.querySelector('.missionBtn');
// 미션 모달창 변수 지정
let missionModal = document.querySelector('.mission_modal');
let isPressed = false; // 미션창 상태

// 미션버튼 클릭 시 화면 출력
missionBtn.addEventListener('click', () => {
    isPressed = !isPressed; // 토글 형태, 현재 상태를 반전시킴
    console.log("미션창", isPressed);

    // true 상태일 때만 모달창 띄움
    if(isPressed === true) { 
        missionModal.style.display = 'block';
    } else {
        missionModal.style.display = 'none';
    }
})

// 미션창에 미션 업데이트
function upDateMission() {
    const missionPanel = document.querySelector(".mission_panel");
    const currentMission = chapterMission[chapter];

    if(currentMission && missionPanel) { // 미션이 존재하면 미션 패널에 출력
        missionPanel.innerHTML = `
            <h1>${currentMission.title}</h1>
            <div class="mission_content">
                <p class="mission_goal"><strong>목표:</strong> ${currentMission.goal}</p>
                <p class="mission_description"><strong>할 일:</strong> ${currentMission.content}</p>
            </div>`;
    }
}

// 슬롯별 선택 이벤트 등록 (게임 시작 시 한 번만 실행)
slots.forEach((slot, index) => {
    slot.addEventListener('click', () => {
        slotItemSelection(index);
    });
});

// 현재 선택된 아이템들을 가져오는 함수
function getSelectedItems() {
    const selectedItems = []; // 선택된 아이템 배열
    
    slots.forEach((slot, index) => {
        // 해당 슬롯에 아이템이 있고, 선택 표시가 보이는지 확인
        if (index < inventory.length) {
            const selectItem = slot.querySelector('.select_item');
            if (selectItem && selectItem.style.display === 'block') {
                selectedItems.push({
                    index: index,
                    itemKey: inventory[index],
                    itemData: itemData[inventory[index]]
                });
            }
        }
    });
    return selectedItems; // 아이템 배열 가져오기
}

// 인벤토리 배열에 아이템 추가 함수
function addInventory(itemKey) {
    inventory.push(itemKey); // 배열에 추가
    updateInventoryUI() // 화면 업데이트
    console.log(`${itemData[itemKey].name} 인벤토리 추가`);
    console.log(inventory); // 인벤토리 안에 뭐있는지 출력
    return true;
}

// 인벤토리에 아이템 출력 함수
function updateInventoryUI() {
    // 모든 슬롯 초기화
    slots.forEach(slot => {
        // item-image 클래스가 붙은 이미지만 찾아서 제거 (전체 초기화 시 아이템 선택 이미지가 날아감)
        const exItemImg = slot.querySelector('.item-image');
        if (exItemImg) {
            exItemImg.remove();
        }
        
        // 비어있는 슬롯 
        slot.removeAttribute('data-tooltip'); // 데이터 지우기
        slot.classList.remove("inItem"); // 클래스 지우기
    });
    
    // 인벤토리 순서대로 아이템 슬롯에 표시
    inventory.forEach((itemKey, index) => {
        const slot = slots[index]; // 순서에 알맞게 슬롯 가져옴
        const item = itemData[itemKey]; // 게임 데이터에서 아이템 정보 가져옴
        
        // 아이템 이미지 생성
        const itemImgs = document.createElement('img');
        itemImgs.src = item.image; // 이미지 경로
        itemImgs.alt = item.name; // 이미지 설명(이름으로)
        itemImgs.style.width = '100%'; // 사이즈
        itemImgs.style.height = '100%'; // 사이즈
        itemImgs.classList.add('item-image'); // 클래스 추가

        slot.classList.add("inItem"); // 툴팁 표시 클래스 추가
        slot.setAttribute('data-tooltip', `${item.name}\n효과: ${item.effect}\n설명: ${item.description}`); // 툴팁 내용

        // 슬롯에 아이템 이미지 추가
        slot.appendChild(itemImgs);
    });

    // 챕터 1이면서 인벤토리에 아이템이 4개 있으면
    if (chapter === 1 && inventory.length === 4) {
        chapter1Clear = true; // 챕터1 미션 클리어
    }
}

// 아이템 사용 여부 (처음엔 다 비활성화)
let itemCane = false;
let itemPhone = false;
let itemAudible = false;
let itemAirpods = false;

// 화면 블러 효과
let blurOverlay = document.querySelector('.blur-overlay'); 

// 슬롯 아이템 작동
function slotItemSelection(slotIndex) {
    // 슬롯 아이템 여부 확인 (빈 칸 클릭 시 활성화 방지)
    if(slotIndex >= inventory.length) { // 슬롯인덱스의 숫자가 인벤토리 배열의 갯수보다 많으면
        return; // 함수종료(선택 표시 안됨)
    }

    const slot = slots[slotIndex];
    const selectItem = slot.querySelector('.select_item');
    const itemKey = inventory[slotIndex];

    // 슬롯의 선택여부 구별
    if (selectItem.style.display === 'block') { // 선택 표시 이미지가 보이는 상태면
        selectItem.style.display = 'none'; // 선택 표시 이미지 끄기
        
        if(itemKey === 'cane') { // 흰지팡이 활성화
            useCane();
        }

        if(itemKey === 'audible'){ // 음향신호기 활성화
            useAudible();
        }

        if(itemKey === 'airpods'){ // 에어팟 활성화
            useAirPods()
        }

        if(itemKey === 'phone'){ // 휴대폰 활성화
            usePhone()
        }

    } else { // 선택 표시 이미지가 안보이는 상태면
        selectItem.style.display = 'block'; // 선택 표시 이미지 켜기
        
        if(itemKey === 'cane') { // 흰지팡이 비활성화
            useCane();
        }

        if(itemKey === 'audible'){ // 음향신호기 비활성화
            useAudible();
        }

        if(itemKey === 'airpods'){ // 에어팟 비활성화
            useAirPods()
        }

        if(itemKey === 'phone'){ // 휴대폰 비활성화
            usePhone()
        }
    }
}

// 흰지팡이 사용
function useCane() {  // 모든 챕터에서 사용
    itemCane = !itemCane;
    
    if (itemCane) { // 흰지팡이가 사용되었다면
        blurOverlay.style.display = 'none'; // 블러 끄기
        player.classList.add('cane'); // 플레이어 배경 이미지 변경
        console.log('흰지팡이 사용');
    } else {
        blurOverlay.style.display = 'block'; // 블러 켜기
        player.classList.remove('cane'); // 플레이어 배경 이미지 변경
        console.log('흰지팡이 해제');
    }
}
// 음향신호기 사용
function useAudible() {

    if(chapter === 2 || chapter === 4) { // 챕터2, 챕터4에서만 사용

        // 현재 챕터의 차량만 정확히 찾기
        // * 4챕터에서 음향신호기가 작동되지 않는 오류(2챕터의 차량만 변경되고 4챕터 차량은 변경 안됨) 발생하여, claudeAI에서 도움을 받아 각 챕터 별로 정확하게 차량 오브젝트를 찾는 것으로 오류 해결함!!* 
        const car1 = document.querySelector(`.chapter_${chapter} .de_car1`) || 
            document.querySelector(`.chapter_${chapter} .ivory`);
        const car2 = document.querySelector(`.chapter_${chapter} .de_car2`) || 
            document.querySelector(`.chapter_${chapter} .blue`);
        const car3 = document.querySelector(`.chapter_${chapter} .de_car3`) || 
            document.querySelector(`.chapter_${chapter} .white`);
        const car4 = document.querySelector(`.chapter_${chapter} .de_car4`) || 
            document.querySelector(`.chapter_${chapter} .black`);

        if (!itemAudible) { // 음향신호기 사용 상태가 false일때 실행
            console.log('음향신호기 사용');
            playVoice('audio/stop.mp3'); // 아이템 사용 시 음성안내

            crosswalkOff[chapter] = false; // 횡단보도 장애물 상태 false

            // 클래스 넣고 빼서 애니메이션 변경
            car1?.classList.remove('de_car1');
            car1?.classList.add('ivory');
            
            car2?.classList.remove('de_car2');
            car2?.classList.add('blue');
            
            car3?.classList.remove('de_car3');
            car3?.classList.add('white');
            
            car4?.classList.remove('de_car4');
            car4?.classList.add('black');
            
            // 녹색불이 켜졌다는 음성안내 7.5초 후에
            setTimeout(() => {
                playVoice('audio/greenlight.mp3');
            }, 6900);

            // 아이템 사용 상태 변경
            itemAudible = true;
            
        } else {

            crosswalkOff[chapter] = true; // 횡단보도 장애물 상태 true

            console.log('음향신호기 사용 해제');
            car1?.classList.remove('ivory');
            car1?.classList.add('de_car1');
            
            car2?.classList.remove('blue');
            car2?.classList.add('de_car2');
            
            car3?.classList.remove('white');
            car3?.classList.add('de_car3');
            
            car4?.classList.remove('black');
            car4?.classList.add('de_car4');
            
            itemAudible = false;
        }
    } else {
        playVoice('audio/none_crosswalk.mp3');
        console.log('현재 챕터에서 사용 불가능');
    }
}

// 휴대폰 사용
function usePhone() {
    const mission5 = document.querySelector('.mission_5'); // 미션 모달창
    itemPhone = !itemPhone; // 토글형식 사용

    if (chapter === 5) {
        if(itemPhone){
            if(isClearZone) { // 챕터 5이면서 클리어존일때만 실행
                mission5.style.display = 'block';
                console.log('챕터 5 미션모달 열림');
                onPhoneScreen() 
            }
            console.log('스마트폰 사용'); // 챕터 5이지만 침대 위가 아닐경우 콘솔만 출력
        } else { // 스마트폰 아이템 사용 해제 시
            mission5.style.display = 'none'; 
            console.log('챕터 5 미션모달 닫힘');
            console.log('스마트폰 사용 해제');
        }
    } else { // 챕터 5가 아닌 다른 챕터에서 사용 시 
        console.log('이동중 스마트폰 사용'); 
        itemPhone = !itemPhone;
    }
    
}
// 에어팟 사용
function useAirPods() {
    itemAirpods = !itemAirpods; // 토글형식 사용
    
    if (itemAirpods) {
        playVoice('audio/AirPods_open.mp3'); // 에어팟 켜는 사운드 재생
        console.log('에어팟 사용');
    } else {
        playVoice('audio/AirPods_Closed.mp3'); // 에어팟 끄는 사운드 재생
        console.log('에어팟 사용 해제');
    }
}
// 음성안내 출력
function playVoice(audioSrc) {
    const voice = new Audio(audioSrc);
    voice.play();
}

// 챕터 1 아이템 클릭 시 화면에서 사라지게
roomCane.addEventListener('click', () => {
    if(addInventory('cane')){ // 인벤토리배열에 추가되면
        roomCane.style.display = 'none'; // 배경에서 숨기기
        console.log('흰지팡이가 선택되었습니다.');
    }
});

roomPhone.addEventListener('click', () => {
    if(addInventory('phone')){
        roomPhone.style.display = 'none';
        console.log('스마트폰이 선택되었습니다.');
    }
});

roomAudible.addEventListener('click', () => {
    if(addInventory('audible')){
        roomAudible.style.display = 'none';
        console.log('음향신호기가 선택되었습니다.');
    }
});

roomAirpods.addEventListener('click', () => {
    if(addInventory('airpods')){
        roomAirpods.style.display = 'none';
        console.log('에어팟이 선택되었습니다.');
    }
});


// 장애물 충돌 유무
function isColliding(nextX, nextY) {
    const playerWidth = player.offsetWidth;  
    const playerHeight = player.offsetHeight;

    // 챕터 2,4 의 음향신호기 사용으로 횡단보도 장애물 제거
    if((chapter === 2 || chapter === 4) && crosswalkOff[chapter]) {
        const [x, y, width, height] = crosswalk[chapter];

        if (nextX < x + width && 
            nextX + playerWidth > x &&
            nextY < y + height &&
            nextY + playerHeight > y) {

            return true; // 횡단보도 영역에서만 막기
        }
    }

    const obstacles = chapterObstacles[chapter] || [];

    // 배열 안에 요소 중 하나라도 조건 만족 시 true 반환
    return obstacles.some(([x, y, width, height]) => {
        // 장애물과 플레이어가 겹치지 않는 조건 찾기
        return (
            nextX < x + width && 
            nextX + playerWidth > x &&
            nextY < y + height &&
            nextY + playerHeight > y
        );
    });
}

// 클리어 장소 확인
function chapterClearPos(nextX, nextY) {
    const playerWidth = player.offsetWidth; 
    const playerHeight = player.offsetHeight;

    const clearPos = chapterClearPosition[chapter] || [];

    // 배열 안에 요소 중 하나라도 조건 만족 시 true 반환
    return clearPos.some(([x, y, width, height]) => {
        // 플레이어가 클리어 구역 안에 있는지 확인 (겹치는 조건)
        return (
            nextX < x + width && 
            nextX + playerWidth > x &&
            nextY < y + height &&
            nextY + playerHeight > y
        );
    });
}

// 챕터별 클리어 조건 확인
function checkClearCondition() {
    // 클리어 조건 케이스로 구현
    switch (chapter) {
        case 1:
            return chapter1Clear;
        case 2:
            return true; // 클리어존 도착하면 클리어
        case 3:
            return chapter3Clear;
        case 4:
            return true; // 클리어존 도착하면 클리어
        case 5:
            return chapter5Clear;
        default:
            return true;
    }
}

// 클리어 구역 체크 및 상호작용 패널 표시
function checkClearZone() {
    let screenRect = screen.getBoundingClientRect();
    let playerRect = player.getBoundingClientRect();
    let currentLeft = playerRect.left - screenRect.left;
    let currentTop = playerRect.top - screenRect.top;

    const clearZone = isClearZone;
    isClearZone = chapterClearPos(currentLeft, currentTop);

    // 클리어 구역 진입/나갈 때 상호작용 패널 토글
    if (isClearZone && !clearZone) { // 클리어 구역 진입 시

        // 클리어 조건을 만족했는지 확인
        if(checkClearCondition()){
            interactPanel.style.display = 'block'; // 상호작용 패널 띄우기
            console.log('클리어 조건 만족 & 클리어 구역에 도달!');
        }
        
    } else if (!isClearZone && clearZone) { // 클리어 구역이 아니면
        interactPanel.style.display = 'none';
    }
}

// 아이템 상태 초기화 (챕터 넘어갈 때마다 실행)
function resetItems() {
    // 아이템 사용 상태 초기화
    itemAudible = false;
    itemAirpods = false;
    itemCane = false;
    itemPhone = false;

    // 인벤토리 선택 표시 모두 제거
    const allSelectItems = document.querySelectorAll('.select_item');
    allSelectItems.forEach(selectItem => {
        selectItem.style.display = 'none';
    });

    // 화면 블러 원래대로
    blurOverlay.style.display = 'block'; // 원래 블러 상태로
    player.classList.remove('cane'); // 플레이어에 배경 변경 클래스 제거
    
    // 음향신호기 사용 애니메이션 복구 4종류 차량의 클래스명을 모두 변경
    document.querySelectorAll('.ivory').forEach(car => car.className = 'de_car1');
    document.querySelectorAll('.blue').forEach(car => car.className = 'de_car2');
    document.querySelectorAll('.white').forEach(car => car.className = 'de_car3');
    document.querySelectorAll('.black').forEach(car => car.className = 'de_car4');
    
    console.log('아이템 상태 초기화');
}

// 챕터 이동
function moveToNextChapter() {
    // 클리어 존에 없으면
    if (!isClearZone) {
        console.log('클리어 구역에 있지 않습니다.');
        return; // 아무것도 실행안함
    }

    // 다음 챕터 번호 계산
    const nextChapter = chapter + 1;
    
    // 마지막 챕터 체크
    if (nextChapter > 5) {
        GameEnd(); // 엔딩 시작
        return;
    }
    
    // 현재 챕터 숨기기
    const currentChapterDiv = document.querySelector(`.chapter_${chapter}`);
    const currentFront = document.querySelector(`.chapter_${chapter}_front`);

    // 현재 챕터를 화면에서 숨김
    if (currentChapterDiv) {
        currentChapterDiv.style.display = 'none';
    }
    // 현재 챕터 배경 꾸며주는 요소도 숨김
    if (currentFront) {
        currentFront.style.display = 'none';
    }

    // 챕터 변경
    chapter = nextChapter;
    
    // 새 챕터 보이기
    const newChapterDiv = document.querySelector(`.chapter_${chapter}`);
    const nextFront = document.querySelector(`.chapter_${chapter}_front`);

    // 새로운 챕터 화면에 출력
    if (newChapterDiv) {
        newChapterDiv.style.display = 'block';
    }
    // 새로운 챕터 꾸며주는 요소도 출력
    if (nextFront) {
        nextFront.style.display = 'block';
    }

    // 플레이어 위치 초기화 (게임 데이터에서 받아옴)
    const startPos = chapterStartPositions[chapter];
    if (startPos) {
        player.style.left = startPos.x + 'px';
        player.style.top = startPos.y + 'px';
    }

    resetItems(); // 아이템 상태 초기화

    // 상호작용 패널 숨기기
    interactPanel.style.display = 'none';
    isClearZone = false; // 클리어 존 여부 false

    console.log(`챕터 ${chapter}로 이동했습니다!`);

    playBGM(); // 게임 배경음 재생
    upDateMission(); // 미션 업데이트
}



// 챕터3 테이블&미션 표시/숨김
function tableDisplay() {
    if (chapter !== 3) return; // 챕터3에서만 실행

    const frontTable = document.querySelector('.of_table'); // 프론트 테이블
    const mission3 = document.querySelector('.mission_3'); // 미션 모달창

    let screenRect = screen.getBoundingClientRect(); // 스크린 크기 받아옴
    let playerRect = player.getBoundingClientRect(); // 플레이어 크기 받아옴
    let currentPlayerY = playerRect.top - screenRect.top; //플레이어 y 위치
    let currentPlayerX = playerRect.left - screenRect.left; //플레이어 x 위치
    
    // 플레이어가 y600 이하면 켜고 이상이면 끄기
    if (currentPlayerY < 600) {
        frontTable.style.display = 'block'; // 프론트 테이블 표시
        if (currentPlayerX > 650 && itemAirpods) {
            mission3.style.display = 'block'; // 미션 모달창 표시
        } else {
            mission3.style.display = 'none'; // 미션 모달창 숨김
        }
    } else {
        frontTable.style.display = 'none'; // 프론트 테이블 숨김

    }
}

// 버튼 변수 설정
const lv1 = document.querySelector('.lv1');
const lv2 = document.querySelector('.lv2');
const lv3 = document.querySelector('.lv3');
const inputBtn = document.querySelector('.chapter_3 button'); // 입력버튼

// 각 버튼 클릭 시 음성 재생
lv1.addEventListener('mousedown', () => {
    lv1.classList.add("down");
    playVoice('audio/Level_1.mp3');
})
lv1.addEventListener('mouseup', () => {
    lv1.classList.remove("down");
})
lv2.addEventListener('mousedown', () => {
    lv2.classList.add("down");
    playVoice('audio/Level_2.mp3');
})
lv2.addEventListener('mouseup', () => {
    lv2.classList.remove("down");
})
lv3.addEventListener('mousedown', () => {
    lv3.classList.add("down");
    playVoice('audio/Level_3.mp3');
})
lv3.addEventListener('mouseup', () => {
    lv3.classList.remove("down");
})

// 입력 버튼, 정답 판별
inputBtn.addEventListener('click', () => {
    checkAnswer();
});

// 정답 판별
function checkAnswer() {
    const input = document.querySelector('.missionInput');
    const userAnswer = input.value.trim();
    
    // 각 레벨 정답 확인
    if (userAnswer === answersChapter3.lv1) {
        lv1.classList.add('clear');
        alert('레벨1 클리어!');
    } else if (userAnswer === answersChapter3.lv2) {
        lv2.classList.add('clear');
        alert('레벨2 클리어!');
    } else if (userAnswer === answersChapter3.lv3) {
        lv3.classList.add('clear');
        alert('레벨3 클리어!');
    } else {
        alert('틀렸습니다!');
    }
    
    input.value = ''; // 입력창 초기화

    // 챕터 3 미션 클리어 여부 확인 classList.contains로 클래스에 clear가 붙어있는지 확인
    const lv1Clear = document.querySelector('.lv1').classList.contains('clear');
    const lv2Clear = document.querySelector('.lv2').classList.contains('clear');
    const lv3Clear = document.querySelector('.lv3').classList.contains('clear');

    // 3가지 미션을 모두 성공했을 경우에만
    if (lv1Clear && lv2Clear && lv3Clear) {
        chapter3Clear = true; // 챕터 3 미션 클리어
        console.log('챕터 3 미션 클리어');
    }
}

// 휴대폰 화면 켜짐
function onPhoneScreen() {
    const backDisplayOff = document.querySelector('.back_display_off');
    const backDisplay = document.querySelector('.back_display');

    backDisplayOff.addEventListener('click', () => {
        backDisplayOff.style.display = 'none'; // 검은 화면 숨김
        backDisplay.style.display = 'block'; // 인스타그램 화면 표시
        console.log('스마트폰 화면 켜짐!');

        // 인스타그램 미션 활성화
        instaMission();
    });
}

// 챕터5 사진 클릭 완료 여부확인
let alt1 = false;
let alt2 = false;
let alt3 = false;

// 챕터 5 미션 수행 (스크롤/클릭)
function instaMission() {
    const instaImg1 = document.querySelector('.insta_img_1');
    const instaImg2 = document.querySelector('.insta_img_2');
    const instaImg3 = document.querySelector('.insta_img_3');

    instaImg1.addEventListener('click', () => {
        playVoice('audio/alt_1.mp3');

        if (!alt1) { // 처음 클릭이면
            alt1 = true; // 클릭했다고 표시
            console.log('alt1 클릭 완료');
            checkInsta(); // 미션 완료 체크
        }
    });
    instaImg2.addEventListener('click', () => {
        playVoice('audio/alt_2.mp3');
        
        if (!alt2) { // 처음 클릭이면
            alt2 = true; // 클릭했다고 표시
            console.log('alt2 클릭 완료');
            checkInsta(); // 미션 완료 체크
        }
    });
    instaImg3.addEventListener('click', () => {
        playVoice('audio/alt_3.mp3');

        if (!alt3) { // 처음 클릭이면
            alt3 = true; // 클릭했다고 표시
            console.log('alt3 클릭 완료');
            checkInsta(); // 미션 완료 체크
        }
    });    
}

// 챕터5 미션 완료 체크
function checkInsta() {
    // 3가지 미션을 모두 성공했을 경우에만
    if (alt1 && alt2 && alt3) {
        chapter5Clear = true; // 챕터 5 미션 클리어
        console.log('챕터 5 미션 클리어');
    }
}

// 엔터키(상호작용 : 챕터 이동) 입력 처리
document.addEventListener('keydown', (e) => {

    if (e.key === 'Enter') { // 엔터키를 눌렀을 때

        if (isClearZone) { // 클리어 존에 있으면

            if (chapter === 1 && chapter1Clear) { // 챕터 1이고 1미션을 클리어 했으면 실행
                moveToNextChapter();
            } else if(chapter === 3 && chapter3Clear) { // 챕터 3이고 3미션을 클리어 했으면 실행
                moveToNextChapter();
            } else if(chapter === 5 && chapter5Clear) { // 챕터 5이고 5미션을 클리어 했으면 실행
                moveToNextChapter();
            } else if(chapter === 2 || chapter === 4) {
                moveToNextChapter(); // 챕터 2, 4 는 그냥 도착만 해도 실행
            } else {
                console.log('미션을 모두 완료하지 못했습니다.');
            }
        }
        return; // 플레이어 이동 방지
    }

    // 플레이어 움직임 장애물 움직임 제한
    let screenRect = screen.getBoundingClientRect(); // 스크린 크기 받아옴
    let playerRect = player.getBoundingClientRect(); // 플레이어 크기 받아옴
    let currentLeft = playerRect.left - screenRect.left; // 현재 X 좌표
    let currentTop = playerRect.top - screenRect.top; // 현재 Y 좌표

    let canMove = true; // 이동 가능 여부를 저장하는 변수
    let currentDirection = 'down'; // 기본 값 아래방향(정면)

    // 이동 후의 새로운 위치를 미리 계산
    let nextLeft = currentLeft; // 새로운 X 좌표
    let nextTop = currentTop; // 새로운 Y 좌표
    
    // 키보드 입력에 따른 방향 설정 및 새로운 위치 계산
    if (e.key === 'ArrowLeft') {
        currentDirection = 'left' // 캐릭터 방향 왼쪽
        nextLeft = currentLeft - step; // 왼쪽으로 이동

        // 화면 경계 체크
        if(nextLeft >= 0){
            // 장애물 충동 여부 확인
            if(!isColliding(nextLeft, nextTop)){ // 충돌 없으면
                player.style.left = nextLeft + 'px'; // 왼쪽으로 이동
                
            } else {
                canMove = false; // 장애물 충돌 시 정지
            }
        } else {
            canMove = false; // 화면 경계 도착 시 정지
        }

    } else if (e.key === 'ArrowRight') {
        currentDirection = 'right' // 캐릭터 방향 오른쪽
        nextLeft = currentLeft + step; // 오른쪽으로 이동

        if(nextLeft + player.offsetWidth <= screen.offsetWidth) { 
            // 장애물 충동 여부 확인
            if(!isColliding(nextLeft, nextTop)) { // 충돌 없으면
                player.style.left = nextLeft + 'px'; // 오른쪽으로 이동
                
            } else {
                canMove = false; // 장애물 충돌 시 정지
            }
        } else {
            canMove = false; // 화면 경계 도착 시 정지
        }

    } else if (e.key === 'ArrowUp') {
        currentDirection = 'up'; // 캐릭터 방향 위쪽(후면)
        nextTop = currentTop - step; // 위쪽으로 이동
        
        // 화면 위쪽 경계 체크
        if(nextTop >= 0) {
            // 장애물 충동 여부 확인
            if(!isColliding(nextLeft, nextTop)) { // 충돌 없으면
                player.style.top = nextTop + 'px'; // 위쪽으로 이동
                
            } else {
                canMove = false; // 장애물 충돌 시 정지
            }
        } else {
            canMove = false; // 화면 경계 도착 시 정지
        }

    } else if (e.key === 'ArrowDown') {
        currentDirection = 'down'; // 캐릭터 방향 아래쪽(정면)
        nextTop = currentTop + step; // 아래쪽으로 이동
        
        // 화면 아래쪽 경계 체크 (플레이어 높이 고려)
        if(nextTop + player.offsetHeight <= screen.offsetHeight) {
            // 장애물 충동 여부 확인
            if(!isColliding(nextLeft, nextTop)) { //충돌 없으면
                player.style.top = nextTop + 'px'; // 아래쪽으로 이동
                
            } else {
                canMove = false; // 장애물 충돌 시 정지
            }
        } else {
            canMove = false; // 화면 경계 도착 시 정지
        }
    }

    // 이동 후 클리어 구역 체크
    if (canMove) {
        checkClearZone(); // 클리어구역 확인
        tableDisplay() // 3챕터 테이블 표시/숨김
    }

    // 이동 여부와 관계없이 걷기 애니메이션과 방향 설정
    player.dataset.walking = true; // CSS 애니메이션 활성화
    player.dataset.direction = currentDirection; // 스프라이트 방향 설정
});

// 키를 뗐을 때 걷기 애니메이션 중지
document.addEventListener('keyup', () => {
   player.dataset.walking = false;
})

