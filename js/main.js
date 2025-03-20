document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM fully loaded and parsed');

  // AOS初期化
  AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    mirror: false
  });
  
  // ナビゲーションのクラス変更処理
  const mainNav = document.getElementById('main-nav');
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (navToggle) {
    navToggle.addEventListener('click', function() {
      navMenu.classList.toggle('active');
    });
  }
  
  // スクロール時の処理
  window.addEventListener('scroll', function() {
    // スクロール位置に応じてトップに戻るボタンの表示/非表示
    const backToTopButton = document.getElementById('back-to-top');
    if (backToTopButton) {
      if (window.scrollY > 300) {
        backToTopButton.style.display = 'block';
      } else {
        backToTopButton.style.display = 'none';
      }
    }
    
    // プログレスバーの更新
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
      const windowHeight = window.innerHeight;
      const fullHeight = document.body.scrollHeight - windowHeight;
      const scrolled = (window.scrollY / fullHeight) * 100;
      progressBar.style.width = scrolled + '%';
    }
    
    // ナビゲーションリンクのアクティブ状態の更新
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (window.scrollY >= sectionTop - 100) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  });
  
  // トップに戻るボタンのクリックイベント
  const backToTopButton = document.getElementById('back-to-top');
  if (backToTopButton) {
    backToTopButton.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
  
  // スムーズスクロール
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 70,
          behavior: 'smooth'
        });
        
        // モバイルメニューを閉じる
        if (navMenu && navMenu.classList.contains('active')) {
          navMenu.classList.remove('active');
        }
      }
    });
  });
  
  // グラフの共通オプション
  const commonOptions = {
    responsive: true,
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart'
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: {
            family: '"Noto Sans JP", sans-serif',
            size: 12
          },
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          family: '"Noto Sans JP", sans-serif',
          size: 14
        },
        bodyFont: {
          family: '"Noto Sans JP", sans-serif',
          size: 13
        },
        padding: 15,
        cornerRadius: 6,
        displayColors: true
      }
    }
  };
  
  // ROIチャート
  const roiCtx = document.getElementById('roiChart');
  if (roiCtx) {
    try {
      new Chart(roiCtx, {
        type: 'bar',
        data: {
          labels: ['初年度', '2年目', '3年目', '4年目', '5年目'],
          datasets: [
            {
              label: '年間ROI (%)',
              data: [-15, 35, 85, 120, 162],
              backgroundColor: [
                'rgba(220, 53, 69, 0.7)',
                'rgba(40, 167, 69, 0.7)',
                'rgba(40, 167, 69, 0.7)',
                'rgba(40, 167, 69, 0.7)',
                'rgba(40, 167, 69, 0.7)'
              ],
              borderColor: [
                'rgba(220, 53, 69, 1)',
                'rgba(40, 167, 69, 1)',
                'rgba(40, 167, 69, 1)',
                'rgba(40, 167, 69, 1)',
                'rgba(40, 167, 69, 1)'
              ],
              borderWidth: 1
            },
            {
              label: '累積ROI (%)',
              data: [-15, 20, 105, 225, 387],
              type: 'line',
              borderColor: 'rgba(0, 123, 255, 1)',
              backgroundColor: 'rgba(0, 123, 255, 0.1)',
              borderWidth: 2,
              fill: false,
              tension: 0.1
            }
          ]
        },
        options: {
          ...commonOptions,
          scales: {
            y: {
              beginAtZero: false,
              title: {
                display: true,
                text: 'ROI (%)'
              }
            }
          }
        }
      });
      console.log('ROI chart initialized');
    } catch (error) {
      console.error('Error initializing ROI chart:', error);
    }
  }
  
  // ROIサマリーチャート（エグゼクティブサマリー用）
  const roiSummaryCtx = document.getElementById('roiSummaryChart');
  if (roiSummaryCtx) {
    try {
      new Chart(roiSummaryCtx, {
        type: 'doughnut',
        data: {
          labels: ['人件費削減', 'ペーパーレス化', 'エラー削減', '遅延リスク低減', 'インフラコスト'],
          datasets: [{
            data: [1800, 350, 1200, 2300, 1000],
            backgroundColor: [
              'rgba(0, 123, 255, 0.7)',
              'rgba(40, 167, 69, 0.7)',
              'rgba(255, 193, 7, 0.7)',
              'rgba(220, 53, 69, 0.7)',
              'rgba(111, 66, 193, 0.7)'
            ],
            borderColor: '#fff',
            borderWidth: 2
          }]
        },
        options: {
          ...commonOptions,
          cutout: '65%',
          plugins: {
            ...commonOptions.plugins,
            tooltip: {
              ...commonOptions.plugins.tooltip,
              callbacks: {
                label: function(context) {
                  const label = context.label || '';
                  const value = context.raw;
                  return label + ': ' + value + '万円/年';
                }
              }
            }
          }
        }
      });
      console.log('ROI Summary chart initialized');
    } catch (error) {
      console.error('Error initializing ROI Summary chart:', error);
    }
  }
  
  // パフォーマンスチャート
  const performanceCtx = document.getElementById('performanceChart');
  if (performanceCtx) {
    try {
      new Chart(performanceCtx, {
        type: 'bar',
        data: {
          labels: ['情報アクセス速度', 'コラボレーション効率', 'データ統合度', 'レポート作成時間', 'リモート対応性'],
          datasets: [{
            label: '現行システム評価（10点満点）',
            data: [3, 4, 2, 3, 2],
            backgroundColor: 'rgba(220, 53, 69, 0.7)',
            borderColor: 'rgba(220, 53, 69, 1)',
            borderWidth: 1
          }]
        },
        options: {
          ...commonOptions,
          maintainAspectRatio: false,
          aspectRatio: 1.5,
          indexAxis: 'y',
          scales: {
            x: {
              beginAtZero: true,
              max: 10,
              grid: {
                display: true,
                color: 'rgba(0, 0, 0, 0.05)'
              },
              ticks: {
                stepSize: 2
              }
            },
            y: {
              grid: {
                display: false
              }
            }
          },
          plugins: {
            ...commonOptions.plugins,
            legend: {
              ...commonOptions.plugins.legend,
              position: 'bottom',
              align: 'start'
            }
          }
        }
      });
      console.log('Performance chart initialized');
    } catch (error) {
      console.error('Error initializing performance chart:', error);
    }
  }
  
  // 競合他社比較レーダーチャート
  const radarCtx = document.getElementById('competitorRadar');
  if (radarCtx) {
    try {
      new Chart(radarCtx, {
        type: 'radar',
        data: {
          labels: ['モバイル対応', 'データ分析', 'コラボレーション', 'セキュリティ', 'カスタマイズ性', 'ユーザビリティ'],
          datasets: [
            {
              label: '当社現行システム',
              data: [3, 2, 4, 5, 2, 3],
              backgroundColor: 'rgba(220, 53, 69, 0.2)',
              borderColor: 'rgba(220, 53, 69, 1)',
              pointBackgroundColor: 'rgba(220, 53, 69, 1)',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: 'rgba(220, 53, 69, 1)'
            },
            {
              label: '競合他社平均',
              data: [7, 6, 8, 7, 6, 7],
              backgroundColor: 'rgba(0, 160, 233, 0.2)',
              borderColor: 'rgba(0, 160, 233, 1)',
              pointBackgroundColor: 'rgba(0, 160, 233, 1)',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: 'rgba(0, 160, 233, 1)'
            },
            {
              label: '提案システム',
              data: [9, 9, 10, 9, 8, 9],
              backgroundColor: 'rgba(40, 167, 69, 0.2)',
              borderColor: 'rgba(40, 167, 69, 1)',
              pointBackgroundColor: 'rgba(40, 167, 69, 1)',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: 'rgba(40, 167, 69, 1)'
            }
          ]
        },
        options: {
          ...commonOptions,
          maintainAspectRatio: false,
          aspectRatio: 1,
          scales: {
            r: {
              min: 0,
              max: 10,
              ticks: {
                stepSize: 2,
                display: false
              },
              pointLabels: {
                font: {
                  size: 12
                }
              },
              grid: {
                color: 'rgba(0, 0, 0, 0.1)'
              },
              angleLines: {
                color: 'rgba(0, 0, 0, 0.1)'
              }
            }
          },
          plugins: {
            ...commonOptions.plugins,
            legend: {
              position: 'bottom',
              align: 'center',
              labels: {
                boxWidth: 15,
                padding: 15
              }
            },
            tooltip: {
              ...commonOptions.plugins.tooltip,
              callbacks: {
                label: function(context) {
                  return context.dataset.label + ': ' + context.raw + '/10';
                }
              }
            }
          }
        }
      });
      console.log('Radar chart initialized');
    } catch (error) {
      console.error('Error initializing radar chart:', error);
    }
  }
  
  // カウンターアニメーション
  const counters = document.querySelectorAll('.counter');
  counters.forEach(counter => {
    counter.innerText = '0';
    
    const updateCounter = () => {
      const target = +counter.getAttribute('data-target');
      const count = +counter.innerText;
      
      const increment = target / 100;
      
      if (count < target) {
        counter.innerText = Math.ceil(count + increment);
        setTimeout(updateCounter, 20);
      } else {
        counter.innerText = target;
      }
    };
    
    // スクロール時にカウンターを開始
    const counterSection = counter.closest('section');
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        updateCounter();
        observer.disconnect();
      }
    }, { threshold: 0.5 });
    
    if (counterSection) {
      observer.observe(counterSection);
    }
  });
  
  // 必要性セクションのグラフ
  // デジタル化トレンドチャート
  const digitalTrendCtx = document.getElementById('digitalTrendChart');
  if (digitalTrendCtx) {
    try {
      new Chart(digitalTrendCtx, {
        type: 'line',
        data: {
          labels: ['2019', '2020', '2021', '2022', '2023', '2024', '2025'],
          datasets: [
            {
              label: 'クラウド採用率',
              data: [32, 45, 58, 68, 78, 85, 92],
              borderColor: 'rgba(0, 123, 255, 1)',
              backgroundColor: 'rgba(0, 123, 255, 0.1)',
              tension: 0.3,
              fill: true
            },
            {
              label: 'デジタルコラボレーションツール利用率',
              data: [28, 52, 65, 75, 82, 88, 94],
              borderColor: 'rgba(40, 167, 69, 1)',
              backgroundColor: 'rgba(40, 167, 69, 0.1)',
              tension: 0.3,
              fill: true
            },
            {
              label: 'AI/ML導入率',
              data: [12, 18, 25, 35, 48, 65, 80],
              borderColor: 'rgba(255, 193, 7, 1)',
              backgroundColor: 'rgba(255, 193, 7, 0.1)',
              tension: 0.3,
              fill: true
            }
          ]
        },
        options: {
          ...commonOptions,
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              title: {
                display: true,
                text: '採用率 (%)'
              }
            }
          }
        }
      });
      console.log('Digital trend chart initialized');
    } catch (error) {
      console.error('Error initializing digital trend chart:', error);
    }
  }

  // リモートワーク課題分布チャート
  const remoteChallengesCtx = document.getElementById('remoteChallengesPie');
  if (remoteChallengesCtx) {
    try {
      new Chart(remoteChallengesCtx, {
        type: 'pie',
        data: {
          labels: ['コミュニケーション', 'ドキュメント管理', 'プロジェクト進捗把握', 'セキュリティ', 'システム互換性'],
          datasets: [{
            data: [35, 25, 20, 12, 8],
            backgroundColor: [
              'rgba(220, 53, 69, 0.7)',
              'rgba(255, 193, 7, 0.7)',
              'rgba(40, 167, 69, 0.7)',
              'rgba(0, 123, 255, 0.7)',
              'rgba(111, 66, 193, 0.7)'
            ],
            borderColor: '#fff',
            borderWidth: 2
          }]
        },
        options: {
          ...commonOptions,
          plugins: {
            ...commonOptions.plugins,
            tooltip: {
              ...commonOptions.plugins.tooltip,
              callbacks: {
                label: function(context) {
                  const label = context.label || '';
                  const value = context.raw;
                  return label + ': ' + value + '%';
                }
              }
            }
          }
        }
      });
      console.log('Remote challenges pie chart initialized');
    } catch (error) {
      console.error('Error initializing remote challenges pie chart:', error);
    }
  }
  
  // 業務効率化チャート
  const efficiencyCtx = document.getElementById('efficiencyChart');
  if (efficiencyCtx) {
    try {
      new Chart(efficiencyCtx, {
        type: 'horizontalBar',
        data: {
          labels: ['プロジェクト管理', 'リソース配分', '情報共有', '意思決定速度', 'レポート作成'],
          datasets: [{
            label: '効率化率（%）',
            data: [42, 38, 65, 52, 78],
            backgroundColor: [
              'rgba(0, 123, 255, 0.7)',
              'rgba(40, 167, 69, 0.7)',
              'rgba(255, 193, 7, 0.7)',
              'rgba(111, 66, 193, 0.7)',
              'rgba(23, 162, 184, 0.7)'
            ],
            borderColor: [
              'rgba(0, 123, 255, 1)',
              'rgba(40, 167, 69, 1)',
              'rgba(255, 193, 7, 1)',
              'rgba(111, 66, 193, 1)',
              'rgba(23, 162, 184, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          ...commonOptions,
          indexAxis: 'y',
          scales: {
            x: {
              beginAtZero: true,
              max: 100,
              title: {
                display: true,
                text: '効率化率（%）'
              }
            }
          },
          plugins: {
            ...commonOptions.plugins,
            tooltip: {
              ...commonOptions.plugins.tooltip,
              callbacks: {
                label: function(context) {
                  return context.dataset.label + ': ' + context.raw + '%';
                }
              }
            }
          }
        }
      });
      console.log('Efficiency chart initialized');
    } catch (error) {
      console.error('Error initializing efficiency chart:', error);
    }
  }

  // コスト削減内訳チャート
  const costReductionCtx = document.getElementById('costReductionChart');
  if (costReductionCtx) {
    try {
      new Chart(costReductionCtx, {
        type: 'doughnut',
        data: {
          labels: ['人件費', 'システム運用費', '会議・移動コスト', 'ミス・遅延防止', 'インフラコスト'],
          datasets: [{
            data: [40, 25, 15, 12, 8],
            backgroundColor: [
              'rgba(40, 167, 69, 0.7)',
              'rgba(0, 123, 255, 0.7)',
              'rgba(255, 193, 7, 0.7)',
              'rgba(23, 162, 184, 0.7)',
              'rgba(111, 66, 193, 0.7)'
            ],
            borderColor: '#fff',
            borderWidth: 2
          }]
        },
        options: {
          ...commonOptions,
          cutout: '65%',
          plugins: {
            ...commonOptions.plugins,
            tooltip: {
              ...commonOptions.plugins.tooltip,
              callbacks: {
                label: function(context) {
                  const label = context.label || '';
                  const value = context.raw;
                  const total = context.dataset.data.reduce((acc, data) => acc + data, 0);
                  const percentage = Math.round((value / total) * 100);
                  return label + ': ' + percentage + '% (年間 約' + (value * 20) + '万円)';
                }
              }
            }
          }
        }
      });
      console.log('Cost reduction chart initialized');
    } catch (error) {
      console.error('Error initializing cost reduction chart:', error);
    }
  }
  
  // 初期投資額の内訳チャート
  const initialInvestmentCtx = document.getElementById('initialInvestmentChart');
  if (initialInvestmentCtx) {
    try {
      new Chart(initialInvestmentCtx, {
        type: 'pie',
        data: {
          labels: ['システム導入費', 'カスタマイズ開発', 'データ移行', 'トレーニング', 'コンサルティング'],
          datasets: [{
            data: [1500, 800, 600, 400, 200],
            backgroundColor: [
              'rgba(0, 123, 255, 0.7)',
              'rgba(111, 66, 193, 0.7)',
              'rgba(255, 193, 7, 0.7)',
              'rgba(23, 162, 184, 0.7)',
              'rgba(40, 167, 69, 0.7)'
            ],
            borderColor: '#fff',
            borderWidth: 2
          }]
        },
        options: {
          ...commonOptions,
          plugins: {
            ...commonOptions.plugins,
            tooltip: {
              ...commonOptions.plugins.tooltip,
              callbacks: {
                label: function(context) {
                  const label = context.label || '';
                  const value = context.raw;
                  return label + ': ' + value + '万円';
                }
              }
            }
          }
        }
      });
      console.log('Initial investment chart initialized');
    } catch (error) {
      console.error('Error initializing initial investment chart:', error);
    }
  }
  
  // 業務効率化詳細チャート
  const efficiencyDetailCtx = document.getElementById('efficiencyDetailChart');
  if (efficiencyDetailCtx) {
    try {
      new Chart(efficiencyDetailCtx, {
        type: 'bar',
        data: {
          labels: ['プロジェクト管理', 'リソース配分', '情報共有', '意思決定速度', 'レポート作成'],
          datasets: [
            {
              label: '現行システム',
              data: [40, 45, 30, 35, 25],
              backgroundColor: 'rgba(220, 53, 69, 0.7)',
              borderColor: 'rgba(220, 53, 69, 1)',
              borderWidth: 1
            },
            {
              label: '提案システム',
              data: [85, 78, 92, 88, 95],
              backgroundColor: 'rgba(40, 167, 69, 0.7)',
              borderColor: 'rgba(40, 167, 69, 1)',
              borderWidth: 1
            }
          ]
        },
        options: {
          ...commonOptions,
          indexAxis: 'y',
          scales: {
            x: {
              beginAtZero: true,
              max: 100,
              title: {
                display: true,
                text: '効率スコア (100点満点)'
              }
            }
          }
        }
      });
      console.log('Efficiency detail chart initialized');
    } catch (error) {
      console.error('Error initializing efficiency detail chart:', error);
    }
  }
  
  // すべての初期化が完了した後、最後にSwiperを初期化
  window.addEventListener('load', function() {
    // Swiperの初期化（ケーススタディ用）
    const swiperContainer = document.querySelector('.swiper-container');
    if (swiperContainer) {
      try {
        console.log('Initializing Swiper...');
        console.log('Swiper elements found:', {
          container: document.querySelector('.swiper-container'),
          wrapper: document.querySelector('.swiper-wrapper'),
          slides: document.querySelectorAll('.swiper-slide').length,
          nextButton: document.querySelector('.swiper-button-next'),
          prevButton: document.querySelector('.swiper-button-prev'),
          pagination: document.querySelector('.swiper-pagination')
        });

        const swiper = new Swiper('.swiper-container', {
          slidesPerView: 1,
          spaceBetween: 30,
          loop: true,
          autoplay: {
            delay: 5000,
            disableOnInteraction: false
          },
          pagination: {
            el: '.swiper-pagination',
            clickable: true
          },
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
          },
          breakpoints: {
            768: {
              slidesPerView: 2
            },
            1024: {
              slidesPerView: 3
            }
          }
        });
        
        // 矢印ボタンのクリックイベントが動作していることを確認するためのデバッグコード
        const nextButton = document.querySelector('.swiper-button-next');
        const prevButton = document.querySelector('.swiper-button-prev');
        
        if (nextButton) {
          nextButton.addEventListener('click', function() {
            console.log('Next button clicked');
          });
        }
        
        if (prevButton) {
          prevButton.addEventListener('click', function() {
            console.log('Prev button clicked');
          });
        }
        
        console.log('Swiper initialized successfully');
      } catch (error) {
        console.error('Error initializing Swiper:', error);
      }
    }
  });
  
  console.log('JavaScript initialization complete');
});