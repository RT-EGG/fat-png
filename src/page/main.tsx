import { FunctionComponent } from "react";
import RadioGroup from "./components/RadioGroup";

export interface Props {

}

export const Main: FunctionComponent<Props> = (props: Props) => {
    return (
        <div>
            <RadioGroup
                defaultValue='create-new'
                items={[
                { value: "create-new", label: "画像を作成する" },
                { value: "add_extra", label: "既存の画像に加工する" }           
                ]}
            />
        </div>
    )
}

export default Main;
