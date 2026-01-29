import { Flex, Grid } from "@radix-ui/themes";
import QRCode from "react-qr-code";
import SpecialSlideTemplate from "./Template";

function Tile({ text, link }) {
    return (
        <Flex direction="row" justify="center" align="center" gap="8" width="100%" className="">
            <QRCode value={link} size={256} fgColor="white" bgColor="transparent" className="min-w-[240px]" />

            <Flex direction="column" justify="center" align="start" gap="4" className="min-w-[200px] flex-grow">
                <p className="flex-grow text-6xl font-medium">{text}</p>
                <p className="break-all text-3xl font-medium text-[--gray-11]">{link.replace(/^mailto:/, "")}</p>
            </Flex>
        </Flex>
    );
}

export default function QRCodes({ callback }) {
    return (
        <SpecialSlideTemplate title="Stay Connected" callback={callback} timeout={20000}>
            <Grid className="auto-rows-fr gap-10" width="100%" height="100%" columns="1fr 1fr" p="7">
                <Tile text="Sign up for our newsletter" link="newsletter.hivemakerspace.com" />
                <Tile text="Sign up for upcoming workshops" link="workshops.hivemakerspace.com" />
                <Tile text="Follow us on Instagram" link="instagram.com/thehivemakerspace" />
                <Tile text="Send us an email" link="mailto:hive@ece.gatech.edu" />
            </Grid>
        </SpecialSlideTemplate>
    );
}
