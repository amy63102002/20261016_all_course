/*女力 AI 數位職涯培育｜成果與 SKILL 導向改版*/
(function () {
  "use strict";
  var courses = [
    {
      id: "course-ai-tools",
      short: "AI 職場工具班", name: "女力 AI 職場實用工具一日班", price: "8,800｜實體 8h",
      copy: "從不會用 AI，到能整理主管交辦、製作通知信、工作追蹤表與行政 SOP。練習可在工作上重複使用的 AI 行政流程。",
      output: "通知信＋會議紀錄＋追蹤表＋行政 SOP", role: "AI 行政助理、數位文書助理",
      headline: "一套 AI 行政工作成果包", kit: "01-ai-office",
      pack: "主管交辦拆解卡、會議待辦範本、通知信與客服回覆、追蹤表欄位、SOP 檢查表，以及履歷／作品集整合說明。",
      canDo: "用 AI 協作整理文件、待辦、信件、工作表格"
    },
    {
      id: "course-ai-tasks",
      short: "AI 企業任務班", name: "女力 AI 企業工作任務實作班", price: "14,800｜實作 10h",
      copy: "想轉向 AI 協作相關的工作？練習用 AI 處理真實企業任務，自己核對異常資料、應對主管變更，最後交付清楚的工作成果。",
      output: "六格任務卡＋核對表＋主管報告＋客服 FAQ", role: "AI 協作行政、資料營運助理、AI 客服作業助理",
      headline: "一套可重複使用的 AI 協作解題流程", kit: "02-ai-tasks",
      pack: "六格 AI 工作卡、資料異常核對表、主管報告模板、FAQ 回覆模板、交付前驗收清單。",
      canDo: "交付主管交辦、核對異常、產出報告"
    },
    {
      id: "course-ai-web",
      short: "AI 網頁工具班", name: "女力 AI 協作程式設計與網頁工具實作班", price: "20,000｜實體 12h",
      copy: "把工作需求變成自己的網頁工具。學會請 AI 幫忙拆功能、製作畫面、測試修改，再發布可展示的網址。",
      output: "網頁作品網址＋PRD 需求書＋測試紀錄", role: "AI 應用助理、數位營運助理、系統應用支援",
      headline: "一個可操作、可展示的工作進度網頁工具", kit: "03-ai-web",
      pack: "一頁式 PRD 需求手冊、個人識別命名規則、網頁／網域架構圖、功能測試表、部署與交付檢查表。",
      canDo: "AI 協作建立、測試、部署網頁工具"
    },
    {
      id: "course-line-workflow",
      short: "LINE OA × AI 班", name: "女力 LINE OA × AI 工作流進階班", price: "20,000｜實體 12h",
      copy: "把零碎的客服訊息整理成流程，結合 LINE 官方帳號、需求表單、客戶追蹤表與講師預建的 AI 工作流。",
      output: "LINE 接待展示＋FAQ＋表單追蹤表", role: "LINE OA 營運助理、數位客服、CRM 作業助理",
      headline: "一套可演示的數位客戶接待流程", kit: "04-line-oa",
      pack: "LINE 接待流程圖、品牌／社群命名規格、FAQ 範本、表單欄位表、工作流驗收單。AI 串接使用講師預建環境與範本。",
      canDo: "設定接待流程、表單、追蹤與工作流測試"
    },
    {
      id: "course-career-portfolio",
      short: "數位轉職作品方案", name: "女力 AI 數位轉職作品強化方案", price: "29,800｜12h＋四週輔導",
      copy: "以網頁工具班為基礎，多四週專題指導。把熟悉的產業情境變成個人作品，練習用三分鐘清楚展示。",
      output: "個人專題＋作品展示頁＋履歷／作品集", role: "AI 應用助理、數位營運／專案助理",
      headline: "一份能向面試官解說的個人數位作品", kit: "05-portfolio",
      pack: "個人化專題 PRD、進度與測試紀錄、網站架構圖、作品展示頁、履歷／作品集合併模板、三分鐘作品介紹工作卡。",
      canDo: "完成個人化作品、說明設計與面試展示"
    }
  ];
  function packHref(item) {return "kits/" + item.kit + "/SKILL.md";}
  function escapeHTML(str) {return String(str).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}
  function openCourseForHash() {
    var id = decodeURIComponent(location.hash.replace(/^#/,""));
    if (!id) return;
    var target = document.getElementById(id);
    if (target && target.matches("details.course-disclosure")) target.open = true;
    if (target && target.closest(".course-disclosure")) target.closest(".course-disclosure").open = true;
  }

  document.addEventListener("DOMContentLoaded", function () {
    var main = document.querySelector("main"), overview = document.getElementById("overview");
    if (!main || !overview || !document.getElementById("hero")) return;

    // Keep a single and identifiable course-series name across header/footer/social previews.
    document.querySelector(".site-branding").textContent = "女力 AI 數位職涯培育";
    var footer = document.querySelector(".footer-inner > p");
    if (footer) footer.textContent = "女力 AI 數位職涯培育｜把 AI 協作能力變成可展示的工作作品";
    var desc = document.querySelector('meta[name="description"]');
    if (desc) desc.content = "五種女力 AI 課程的費用、作品、SKILL 工具包與 AI 相關職務方向比較，從行政任務、企業資料、網頁工具到 LINE OA 工作流。";

    var heroPaths = document.querySelector(".hero-paths");
    if (heroPaths) {
      heroPaths.outerHTML = '<div class="hero-actions"><a class="primary-action" href="#comparison">先比較哪一班適合我 →</a><a class="secondary-action" href="#courses">看作品與工具包</a></div>' +
      '<details class="learning-map"><summary>查看 AI 學習地圖（點開才顯示）<span class="toggle-sign" aria-hidden="true">＋</span></summary><div class="map-content">' +
      courses.map(function(c, index){return '<a href="#'+c.id+'"><strong>'+(index+1)+'. '+escapeHTML(c.short)+'</strong><br>'+escapeHTML(c.canDo)+'</a>';}).join("") +
      '</div></details>';
    }

    var nav = document.querySelector("header nav");
    if (nav) {
      var firstCourse = nav.querySelector('a[href="#courses"]');
      if (firstCourse) firstCourse.insertAdjacentHTML("beforebegin",'<a href="#comparison">快速比較</a>');
      var teachingNav = nav.querySelector('a[href="#teaching"]');
      if (teachingNav) teachingNav.insertAdjacentHTML("beforebegin",'<a href="#instructor">講師資歷</a>');
    }

    var cards = overview.querySelectorAll(".course-card");
    cards.forEach(function(card,index){
      var c = courses[index]; if (!c) return;
      var intro = card.querySelector(".card-positioning"), link = card.querySelector(".card-link");
      if (intro) intro.textContent = c.copy;
      if (link) {
        link.textContent = "看這班能帶走什麼 →";
        link.insertAdjacentHTML("beforebegin", '<div class="card-result"><strong>帶走：'+escapeHTML(c.output)+'</strong><span>可探索：'+escapeHTML(c.role)+'</span></div>');
      }
    });

    var compare = document.createElement("section");
    compare.id = "comparison"; compare.className = "container";
    compare.setAttribute("aria-labelledby","comparison-title");
    compare.innerHTML =
      '<h2 id="comparison-title">五種課程，一張表看懂能帶走什麼</h2>' +
      '<p class="section-lead">先看想做的工作，再看哪一門能讓你累積作品。職務欄為<strong>可探索方向，並非保證錄取或就業</strong>。</p>' +
      '<div class="comparison-scroll" role="region" tabindex="0" aria-label="五門課程比較，可左右捲動"><table class="comparison-table"><thead><tr><th scope="col">課程</th><th scope="col">費用／時數</th><th scope="col">學完能做什麼</th><th scope="col">作品／SKILL 包</th><th scope="col">可探索的 AI 職務</th></tr></thead><tbody>' +
      courses.map(function(c){return '<tr><th scope="row"><a href="#'+c.id+'">'+escapeHTML(c.short)+'</a></th><td>'+escapeHTML(c.price)+'</td><td>'+escapeHTML(c.canDo)+'</td><td>'+escapeHTML(c.output)+'</td><td>'+escapeHTML(c.role)+'</td></tr>';}).join("") +
      '</tbody></table></div><p class="small-note">手機可左右滑動比較表。SKILL 包為可編輯的教學模板，仍需依個人情境調整、檢查與驗收。</p>' +
      '<div class="hero-actions"><a class="secondary-action" href="kits/README.md" download>下載工具包目錄 ↓</a><a class="secondary-action" href="PRD-作品規劃手冊.md" download>PRD 規劃手冊／架構圖 ↓</a><a class="secondary-action" href="kits/老師接單工具包/SKILL.md" download>老師接單範例工具包 ↓</a></div>';
    overview.insertAdjacentElement("afterend", compare);

    var coursesTitle = document.getElementById("courses-title");
    if (coursesTitle) {
      coursesTitle.textContent = "選一門，才展開完整課程與工具包";
      coursesTitle.insertAdjacentHTML("afterend", '<p class="section-lead">詳細課綱先收起來。點你有興趣的課程，就能直接看這班的實作成果、下載範本與完整單元。</p>');
    }
    courses.forEach(function(c){
      var article = document.getElementById(c.id);
      if (!article || !article.classList.contains("course-detail")) return;
      var wrapper = document.createElement("details");
      wrapper.id = c.id; wrapper.className = "course-disclosure";
      var summary = document.createElement("summary");
      summary.className = "course-disclosure-summary";
      summary.innerHTML = escapeHTML(c.short) + '｜NT$' + c.price.split("｜")[0] + '<span>點我看成果與課綱 ↓</span>';
      article.parentNode.insertBefore(wrapper,article);
      article.removeAttribute("id");
      wrapper.appendChild(summary);wrapper.appendChild(article);
      var fields = article.querySelector(".course-fields");
      if (fields) fields.insertAdjacentHTML("afterbegin",
        '<div class="field-block deliverables"><h4>上完這堂課，最後能帶走什麼？</h4>' +
        '<p class="deliverable-hero">'+escapeHTML(c.headline)+'</p><p class="field-content">'+escapeHTML(c.pack)+'</p>' +
        '<a class="kit-link" href="'+packHref(c)+'" download>下載「'+escapeHTML(c.short)+'」SKILL 工具包範本（Markdown） ↓</a>' +
        '<p class="small-note">下載檔是實作範本；課堂會帶你依工作情境修改、驗證。學習成果因個人練習與操作條件不同而異。</p></div>');
      if (c.id==="course-ai-tasks") {
        var note=article.querySelector(".title-note");
        if(note)note.textContent="課程名稱與梯次資訊以正式招生公告為準。";
      }
    });
    document.querySelectorAll('a[href^="#course-"]').forEach(function(a) {
      a.addEventListener("click", function(){
        var target = document.getElementById(a.getAttribute("href").slice(1));
        if (target && target.matches(".course-disclosure")) target.open = true;
      });
    });
    openCourseForHash(); window.addEventListener("hashchange",openCourseForHash);

    var teaching=document.getElementById("teaching");
    if(teaching) {
      var section=document.createElement("section");
      section.id="instructor";section.className="container";section.setAttribute("aria-labelledby","instructor-title");
      section.innerHTML=
        '<h2 id="instructor-title">講師資歷與企業實務背景</h2>' +
        '<div class="instructor-panel"><div><span class="eyebrow">實務導向講師</span>' +
        '<h3>阿茲老師｜AI 自動化工程師・AI 工作流程設計師</h3>' +
        '<p>具有企業系統、API 與資料庫開發實務背景，投入 AI 協作、LINE 官方帳號整合與中小企業營運流程自動化。從真實工作問題出發，帶學員拆需求、改功能、查核結果，完成可以清楚展示的作品。</p>' +
        '<div class="instructor-tags"><span>企業系統整合</span><span>AI 協作與工作流程</span><span>LINE OA／資料流程</span><span>網頁工具應用</span></div></div>' +
        '<div class="company-card"><strong>專業團隊背景</strong><p>造雨人科技股份有限公司</p>' +
        '<small>具備企業系統、API／資料庫、AI 工作流程整合相關實務；每梯次實際主辦與授課安排以招生公告為準。</small><p class="small-note"><a class="kit-link" href="kits/講師工具包.md" download>下載講師教學工具包 ↓</a></p></div></div>';
      teaching.insertAdjacentElement("beforebegin",section);
      var principle=teaching.querySelector(".principles-content");
      if (principle) principle.textContent="以完成作品為目標：課堂提供標準案例、可編輯 SKILL 工作卡、PRD 範本、網頁／流程架構圖與驗收清單；學員練習修改、檢查和說明自己做出的成果。";
    }
    var faq=document.getElementById("faq");
    if(faq){
      var registration=document.createElement("section");
      registration.id="registration";registration.className="container";
      registration.setAttribute("aria-labelledby","registration-title");
      registration.innerHTML=
        '<h2 id="registration-title">想報名？先選一門想了解的課</h2>' +
        '<div class="registration-box"><p>先選課程，就能複製一段報名詢問文字。<strong>正式報名表、開課日期與聯繫管道尚待招生公告</strong>，此功能不會自動完成報名或收款。</p>' +
        '<label for="course-select">選擇課程</label><select id="course-select">' +
        courses.map(function(c){return '<option value="'+escapeHTML(c.name)+'">'+escapeHTML(c.short)+'｜NT$'+c.price.split("｜")[0]+'</option>';}).join("")+
        '</select><button type="button" class="primary-action" id="copy-registration">複製報名詢問文字</button>' +
        '<p id="copy-status" class="small-note" aria-live="polite">複製後請傳給正式招生窗口。頁面不會收集姓名、手機或其他個人資料。</p></div>';
      faq.insertAdjacentElement("beforebegin",registration);
      var button=document.getElementById("copy-registration");
      button.addEventListener("click",async function(){
        var message="您好，我想了解「"+document.getElementById("course-select").value+"」的下一梯次報名方式、日期與地點，麻煩提供資訊，謝謝。";
        var status=document.getElementById("copy-status");
        try {
          if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(message);}
          else {var el=document.createElement("textarea");el.value=message;el.style.position="fixed";el.style.opacity="0";document.body.appendChild(el);el.select();var ok=document.execCommand("copy");el.remove();if(!ok)throw Error("copy denied");}
          status.textContent="已複製詢問文字；傳給招生窗口即可詢問。此操作尚未完成報名。";
        } catch (e) {status.textContent="無法自動複製，請手動複製：「"+message+"」";}
      });
    }
    var floating=document.createElement("a");
    floating.className="floating-signup";floating.href="#registration";
    floating.textContent="點我報名 →";floating.setAttribute("aria-label","點我報名，前往報名資訊");
    document.body.appendChild(floating);
  });
})();
