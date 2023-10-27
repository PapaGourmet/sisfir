import { useImage } from 'react-image'

const Home: React.FC = () => {

    function MyImageComponent() {
        const { src } = useImage({
            srcList: 'https://firebasestorage.googleapis.com/v0/b/fcz-cacambas.appspot.com/o/sisfir%2Fmosaico2.jpg?alt=media&token=c45b8a2f-828c-4e46-a138-72d8adb45c31',
        })

        return <img src={src} />
    }

    return (
        <main>
            <div>
                <MyImageComponent />
            </div>
        </main>
    )
}

export default Home