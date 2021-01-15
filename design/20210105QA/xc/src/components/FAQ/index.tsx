import React, { useState, useCallback, useEffect } from 'react';
import './index.less';

// 数据
const data = (() => {
  const title = ['没问题', '有问题的', '没', '有', '并没有', '绝对有问题', '瞎说'];
  return Array.from({ length: 9 }).map((v, i) => {
    return {
      id: i + 1,
      title: title[Math.floor(Math.random() * 6)],
      content: `No.${i} Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
    }
  })
})();

// ----------------------- 重要代码 -----------------------------
interface listType {
  type?: string;
  id?: number;
  title?: string;
  content?: string;
}

// 每一个标签dom生成一个ref，ref在渲染后通过useCallback获取dom元素的位置属性。
// 用属性中的bottom值将问题标签划分成多行。
// 根据bottom值，每一行标签生成一个容器，用来展开时显示问题内容。
// 标签和容器间根据bottom值来关联
// List内相应位置会插入容器的标识(代码49行），利用react的循环渲染自动放到对的位置

const FAQ: React.FC = () => {
  // 当前活动中的标签
  const [currentIndex, setCurrentIndex] = useState<number>();
  // 内容数据
  const [list, setList] = useState<listType[]>([...data]);

  // 容器标识(bottom)及对应list内下标
  // 假设第一行标签bottom为89，第一行有4个元素，那第一行容器和下标就是{ 89： 4 }
  const [contentBoxPosition, setContentBoxPosition] = useState<{
    [key: number] : number;
  }>({});
  // 活动中的容器下标
  const [activeContentBoxIndex, setActiveContentBoxIndex] = useState<number>();
  // 容器显示的内容
  const [contentBoxValue, setContentBoxValue] = useState<listType>();

  useEffect(() => {
    // contentBoxPosition计算完毕后，list对应位置插入容器
    const newList = [...list];
    for (let key in contentBoxPosition) {
      const index = contentBoxPosition[key];
      // 避免重复插入
      if (!list[index] || list[index].type !== 'content') {
        newList.splice(index, 0, {
          type: 'content',
        })
      }
    }
    setList(newList);
  }, [contentBoxPosition])

  // 生成ref并获取dom元素的位置
  const useClientRect = (i: number) => {
    const [rectBottom, setRectBottom] = useState(0);
    let callback = (node: any) => {
      if (node !== null) {
        let bottom = parseInt(node.getBoundingClientRect().bottom, 10);
        setRectBottom(bottom);
        // 记录容器对应的下标, 注：i是列表数据对应的下标，所以对应的容器下标要加上前面的容器数量
        contentBoxPosition[bottom] = i + Object.keys(contentBoxPosition).filter(v => Number(v) < bottom).length + 1;
        setContentBoxPosition(contentBoxPosition);
      }
    }

    return {
      rectBottom, 
      ref: useCallback(callback, [])
    };
  }

  // 控制容器展开收起
  const contentHandler = (bottom: number, item: listType, i: number) => {
    const contentIndex = contentBoxPosition[bottom];
    if (!contentIndex) return false;
    if (currentIndex === i) {
      // 点击展开的项 收起
      setCurrentIndex(undefined);
    } else {
      // 先关后开
      if (contentIndex !== activeContentBoxIndex) setCurrentIndex(undefined);
      setCurrentIndex(i);
      setContentBoxValue(item);
      setActiveContentBoxIndex(contentIndex);
    }
  }

  return (
    <section className="home-faq">
      {list.map((v, i) => {
        if (!v.type) {
          // 正常数据
          const { rectBottom, ref } = useClientRect(i);
          return <div ref={ref}
            key={'tab_' + v.id}
            className={`home-faq__item${currentIndex === i ? ' active' : ''}`}
            onClick={() => contentHandler(rectBottom, v, i)}>
            <span>{v.title}</span>
          </div>
        }
        // 容器
        const show = currentIndex !== undefined && activeContentBoxIndex === i && contentBoxValue;
        const { title, content } = contentBoxValue || {};
        return <div className={`home-faq__contentBox${ show ? ' active' : ''}`} key={'content_' + i}>
          {show && <div className={`home-faq__content${currentIndex !== undefined && activeContentBoxIndex === i ? ' active' : ''}`}>
            <p className="home-faq__content-title">{title}</p>
            <p>{content}</p>
          </div>}
        </div>
      })}
    </section>
  );
}

export default FAQ;
