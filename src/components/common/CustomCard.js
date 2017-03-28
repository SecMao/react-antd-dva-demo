/**
 * Created by Sec on 2017/3/27.
 */
import {Card} from 'antd';
import styles from './CustomCard.css';

/**
 * 引用自定义卡片参考
 * @param showTitle: 是否展示标题，默认展示
 * @param title: 标题内容
 * @param style: 卡片自定义样式
 * @param bodyStyle: 卡片body自定义样式
 * @param loading: 是否加载中
 * @param bordered: 是否显示边框
 * @param extra: 右上角操作区内容
 * @param minBodyHeight: body最小高度
 * @param children
 * @returns {XML}
 * @constructor
 */
function CustomCard({showTitle = true, title, style, children, bodyStyle, loading, bordered, extra, minBodyHeight}) {
  return (
    <Card className={styles.slimCard} title={showTitle ? title : ''} style={style}
          bodyStyle={{...bodyStyle, minHeight: minBodyHeight}}
          loading={loading} bordered={bordered} extra={extra}>
      {children}
    </Card>
  );
}

export default CustomCard;
