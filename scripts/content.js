// 课程文案与小测内容配置
// HTML 结构仍由 app.js 渲染为 .lesson-section 和 .quiz-lesson

window.LessonsContent = {
  order: ["lesson1", "lesson2", "lesson3"],
  lessons: {
    lesson1: {
      leftInner: `
        <div class="card">
          <h2>你已经见过的“向量”</h2>
          <ul class="examples">
            <li><strong>速度：</strong>向东 3 米/秒</li>
            <li><strong>力：</strong>向上 10 牛顿</li>
            <li><strong>位移：</strong>从 A 走到 B</li>
          </ul>
          <p class="explain">
            它们都有两个共同点：有<strong>大小</strong>，有<strong>方向</strong>。<br />
            我们把这类“既有大小又有方向”的量，叫做：<strong>向量</strong>。
          </p>
        </div>

        <div class="card">
          <h2>用数字表示箭头</h2>
          <p>
            在平面上，一个向量可以写成一列数字：
          </p>
          <p class="math">
            v =
            <span class="column-vector">
              <span>x</span>
              <span>y</span>
            </span>
          </p>
          <p>
            第一个数是横向（x 方向）走了多少，第二个数是竖向（y 方向）走了多少。
          </p>
          <p>
            在右边的坐标系中，拖动箭头尖端，看看
            <code>(x, y)</code> 和长度是怎样变化的。
          </p>
        </div>

        <div class="card">
          <h2>多维向量的初印象</h2>
          <p>
            在三维空间是
            <span class="column-vector">
              <span>x</span>
              <span>y</span>
              <span>z</span>
            </span>
            ，在线性代数中，我们还会遇到
            <span class="column-vector">
              <span>x₁</span>
              <span>x₂</span>
              <span>⋮</span>
              <span>xₙ</span>
            </span>
            这样的 n 维向量。
          </p>
          <p>
            你暂时只要记住：它们都是“很多方向上的分量”合在一起的一支箭头。
          </p>
        </div>
      `,
      quizInner: `
        <div class="quiz-item" data-question="q1">
          <p class="quiz-question">
            Q1：向量
            <span class="column-vector">
              <span>-1</span>
              <span>2</span>
            </span>
            最符合哪种描述？
          </p>
          <div class="quiz-options">
            <button data-answer="A">A. 向右 1，向上 2</button>
            <button data-answer="B">B. 向左 1，向上 2</button>
            <button data-answer="C">C. 向左 2，向上 1</button>
          </div>
          <p class="quiz-feedback"></p>
        </div>

        <div class="quiz-item" data-question="q2">
          <p class="quiz-question">
            Q2：向量
            <span class="column-vector">
              <span>6</span>
              <span>8</span>
            </span>
            的长度 |v| 是多少？
          </p>
          <div class="quiz-options">
            <button data-answer="A">A. 7</button>
            <button data-answer="B">B. 10</button>
            <button data-answer="C">C. √(36 + 64)</button>
          </div>
          <p class="quiz-feedback"></p>
        </div>

        <div class="quiz-item" data-question="q3">
          <p class="quiz-question">
            Q3：下面哪个更像是“向量”的例子？
          </p>
          <div class="quiz-options">
            <button data-answer="A">A. 今天是 3 月 16 日</button>
            <button data-answer="B">B. 往东北方向开车，每小时 60 公里</button>
          </div>
          <p class="quiz-feedback"></p>
        </div>
      `,
    },
    lesson2: {
      leftInner: `
        <div class="card">
          <h2>向量加法：接尾法</h2>
          <p>
            想象你先走一段路再走另一段路：先走向量 u，再走向量 v。把 v 的起点放在 u 的终点，
            从原点到最后终点的箭头，就是 u + v。
          </p>
        </div>
        <div class="card">
          <h2>数乘：拉伸与反向</h2>
          <p>
            λv 表示沿着 v 的方向（或反方向）拉伸到 λ 倍。当 λ &gt; 0 时方向不变，长度变为 λ 倍；
            当 λ &lt; 0 时方向相反，长度变为 |λ| 倍。
          </p>
        </div>
        <div class="card">
          <h2>线性组合的第一印象</h2>
          <p>
            w = a·u + b·v 表示：先走 a 步 u，再走 b 步 v，结果仍然是一支箭头。以后我们会把这叫做“线性组合”。
          </p>
        </div>
      `,
      quizInner: `
        <div class="quiz-item" data-question="l2q1">
          <p class="quiz-question">
            Q1：下列哪一种说法，正确描述 u + v？
          </p>
          <div class="quiz-options">
            <button data-answer="A">A. 把两支向量尾巴都放在原点，连成三角形的任意一边。</button>
            <button data-answer="B">B. 先从原点走 u，再从 u 的终点走 v，从原点到最终终点的箭头。</button>
            <button data-answer="C">C. 从 v 的终点画一支箭头回到 u 的终点。</button>
          </div>
          <p class="quiz-feedback"></p>
        </div>
        <div class="quiz-item" data-question="l2q2">
          <p class="quiz-question">
            Q2：相比 v，-2v 的描述是？
          </p>
          <div class="quiz-options">
            <button data-answer="A">A. 方向相同，长度是 v 的 2 倍。</button>
            <button data-answer="B">B. 方向相反，长度是 v 的 2 倍。</button>
            <button data-answer="C">C. 方向相反，长度不变。</button>
          </div>
          <p class="quiz-feedback"></p>
        </div>
        <div class="quiz-item" data-question="l2q3">
          <p class="quiz-question">
            Q3：若 u = (1,0)，v = (0,1)，则 2u + 3v 等于？
          </p>
          <div class="quiz-options">
            <button data-answer="A">A. (2, 3)</button>
            <button data-answer="B">B. (3, 2)</button>
            <button data-answer="C">C. (5, 0)</button>
          </div>
          <p class="quiz-feedback"></p>
        </div>
      `,
    },
    lesson3: {
      leftInner: `
        <div class="card">
          <h2>线性组合回顾</h2>
          <p>
            任何形如 w = a·u + b·v 的向量，都可以理解为：先走 a 步 u，再走 b 步 v。
          </p>
          <p>
            如果我们把所有可能的 a、b 都试一遍，就得到了：用 u 和 v 能“拼”出的所有向量。
          </p>
        </div>
        <div class="card">
          <h2>由向量“张成”的空间（Span）</h2>
          <p>
            记 Span{u, v} = { a·u + b·v | a, b ∈ ℝ }，这是所有线性组合的集合。
          </p>
          <p>
            直觉：Span{u, v} = “用 u 和 v 能铺出来的所有地方”。
          </p>
        </div>
        <div class="card">
          <h2>三种典型情况</h2>
          <ul class="examples">
            <li><strong>只有 u：</strong>Span{u} 是过原点的一条直线。</li>
            <li><strong>u, v 共线：</strong>Span{u, v} 仍然是一条线。</li>
            <li><strong>u, v 不共线：</strong>Span{u, v} 可以铺满整个平面。</li>
          </ul>
        </div>
      `,
      quizInner: `
        <div class="quiz-item" data-question="l3q1">
          <p class="quiz-question">
            Q1：只用一个非零向量 u，Span{u} 是什么？
          </p>
          <div class="quiz-options">
            <button data-answer="A">A. 整个平面</button>
            <button data-answer="B">B. 过原点的一条直线</button>
            <button data-answer="C">C. 只有原点</button>
          </div>
          <p class="quiz-feedback"></p>
        </div>

        <div class="quiz-item" data-question="l3q2">
          <p class="quiz-question">
            Q2：若 v = 2u，那么 Span{u, v} 是？
          </p>
          <div class="quiz-options">
            <button data-answer="A">A. 与 Span{u} 相同的一条线</button>
            <button data-answer="B">B. 整个平面</button>
            <button data-answer="C">C. 比 Span{u} 大一维的空间</button>
          </div>
          <p class="quiz-feedback"></p>
        </div>

        <div class="quiz-item" data-question="l3q3">
          <p class="quiz-question">
            Q3：u = (1, 0)，v = (0, 1)。下列哪一点一定在 Span{u, v} 里？
          </p>
          <div class="quiz-options">
            <button data-answer="A">A. (3, -2)</button>
            <button data-answer="B">B. (0, 0)</button>
            <button data-answer="C">C. 以上两点都在</button>
          </div>
          <p class="quiz-feedback"></p>
        </div>
      `,
    },
  },
};

