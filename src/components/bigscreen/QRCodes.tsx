import { Flex, Grid } from "@radix-ui/themes";
import QRCode from "react-qr-code";
import SlideTemplate from "./SlideTemplate";

interface TileProps {
    text: string;
    link: string;
}

function Tile({ text, link }: TileProps) {
    return (
        <Flex direction="row" justify="center" align="center" gap="8" width="100%">
            <QRCode value={link} size={256} fgColor="white" bgColor="transparent" className="min-w-[240px]" />
            <Flex direction="column" justify="center" align="start" gap="4" className="min-w-[200px] flex-grow">
                <p className="flex-grow text-6xl font-medium">{text}</p>
                <p className="break-all text-3xl font-medium text-[--gray-11]">{link.replace(/^mailto:/, "")}</p>
            </Flex>
        </Flex>
    );
}

interface QRCodesProps {
    callback?: () => void;
}

const QR_LINKS = [
    { text: "Sign up for our newsletter", link: "newsletter.hivemakerspace.com" },
    { text: "Sign up for upcoming workshops", link: "workshops.hivemakerspace.com" },
    { text: "Follow us on Instagram", link: "instagram.com/thehivemakerspace" },
    { text: "Send us an email", link: "mailto:hive@ece.gatech.edu" },
] as const;

export default function QRCodes({ callback }: QRCodesProps) {
    return (
        <SlideTemplate title="Stay Connected" callback={callback} timeout={20000}>
            <Grid className="auto-rows-fr gap-10" width="100%" height="100%" columns="1fr 1fr" p="7">
                {QR_LINKS.map((item) => (
                    <Tile key={item.link} text={item.text} link={item.link} />
                ))}
            </Grid>
        </SlideTemplate>
    );
}
