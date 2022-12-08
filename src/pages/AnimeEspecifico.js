import { Component } from 'react';

// Img
import tohruSad from '../img/tohruSad.png';

// Components
import Main from '../components/Main';
import FlexContainer from '../components/FlexContainer';
import Banner from '../components/Banner';

// Axios
import Api from '../api/Api';

// Router
import { Link } from 'react-router-dom';

class Anime extends Component {
    constructor(props) {
        super(props);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.getError = this.getError.bind(this);
    }

    state = {
        status: 'loading',
        Anime: []
    }

    getError(error) {
        this.setState({
            status: 'error',
            errorCode: error.response.status,
            statusText: error.response.statusText
        })
    }

    async componentDidMount() {
        window.scroll(0, 0);
        var urlAtual = window.location.href;
        var urlClass = new URL(urlAtual);
        var animeID = urlClass.searchParams.get("animeID");

        if (animeID === null) {
            window.location.href = window.location.href.replace(window.location.pathname, '');
        } else {
            const responseAn = await Api.get('/anime/' + animeID)
                .catch((error) => this.getError(error));

            if (this.state.status === 'loading') {

                var genres = '';
                var i = 0;

                responseAn.data.data.genres.map((genre) => {
                    if (i === 0) {
                        genres = genres + genre.name;
                    } else {
                        genres = genres + ' | ' + genre.name;
                    }
                    i++;
                })

                this.setState({
                    status: 'success',
                    Anime: responseAn.data.data,
                    genres: genres
                });
            };
        };
    }

    render() {
        if (this.state.status === 'success') {
            return (
                <>
                    <Banner img={this.state.Anime.images.jpg.large_image_url} />
                    <Main compClass='__anime' >
                        <div className='l-latBar' >
                            <img className='c-animeFolder' src={this.state.Anime.images.jpg.large_image_url} alt='img' />
                        </div>
                        <div className='l-sessions' >
                            <div className='c-animeHeader' >
                                <FlexContainer size='100%' justify='space-between' display='flex'>
                                    <div>
                                        <h1 className='c-title__animeName' >{this.state.Anime.title}</h1>
                                        <p className='c-text__generos' >{this.state.genres}</p>
                                    </div>
                                </FlexContainer>
                            </div>
                            <div className='c-animeTitles' >
                                <FlexContainer size='100%' justify='space-between' display='flex'>
                                    <p className='c-text__titles' >{'Anitory > Anime > ' + this.state.Anime.title}</p>
                                    <p className='c-text__year' >{this.state.Anime.year !== null ? this.state.Anime.year : ''}</p>
                                </FlexContainer>
                            </div>
                        </div>
                    </Main>
                </>
            );
        } else if (this.state.status === 'loading') {
            return (
                <Main>
                    <p>loading...</p>
                </Main>
            );
        } else if (this.state.status === 'error') {
            return (
                <Main>
                    <FlexContainer display='flex' size='100%' wrap='wrap' justify='center'>
                        <FlexContainer size='374px' display='flex' wrap='wrap' justify='center'>
                            <img className='c-errorTohru' src={tohruSad} alt='img' />
                            <div className='c-errorBox' >
                                <h1>{this.state.errorCode}</h1>
                                <p>{this.state.statusText}</p>
                            </div>
                            <p className='c-errorText'>por favor cheque a url: <a href={'/'}>http://Anitory.com</a> </p>
                        </FlexContainer>
                    </FlexContainer>
                </Main>
            );
        }
    }
}

export default Anime;

