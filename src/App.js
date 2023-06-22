import GlobalStyle from './assets/Components/GlobalStyle';
import Header from './assets/Components/Header/Header';
import Content from './assets/Components/Content/Content';

function App() {
  return (
      <GlobalStyle>
        <div className="App">
          <Header />
          <Content/>
        </div>
      </GlobalStyle>
  );
}

export default App;
