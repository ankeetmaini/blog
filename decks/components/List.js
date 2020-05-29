import { Appear } from 'mdx-deck'

export default function List({ children }) {
  const points = React.Children.map(c => <li>{c}</li>)
  return <Appear>{points}</Appear>
}
