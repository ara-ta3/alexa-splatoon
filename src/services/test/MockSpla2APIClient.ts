import { Shake, Splatoon2Matchies } from "../../Contract";
import { Period } from "../../utils/Period";
import { Spla2APIClient } from "../Spla2API";

export class MockSpla2APIClient implements Spla2APIClient {
  async getSchedule(): Promise<Splatoon2Matchies> {
    return {
      regular: [],
      gachi: [
        {
          period: new Period("2020-12-31T07:00:00", "2020-12-31T09:00:00"),
          rule: "ガチヤグラ",
          maps: [
            {
              name: "ショッツル鉱山",
              image: "",
            },
            {
              name: "バッテラストリート",
              image: "",
            },
          ],
        },
        {
          period: new Period("2020-12-31T09:00:00", "2020-12-31T11:00:00"),
          rule: "ガチエリア",
          maps: [
            {
              name: "フジツボスポーツクラブ",
              image: "",
            },
            {
              name: "ムツゴ楼",
              image: "",
            },
          ],
        },
      ],
      league: [
        {
          period: new Period("2020-12-31T07:00:00", "2020-12-31T09:00:00"),
          rule: "ガチエリア",
          maps: [
            {
              name: "ホッケふ頭",
              image: "",
            },
            {
              name: "ガンガゼ野外音楽堂",
              image: "",
            },
          ],
        },
        {
          period: new Period("2020-12-31T09:00:00", "2020-12-31T11:00:00"),
          rule: "ガチヤグラ",
          maps: [
            {
              name: "タチウオパーキング",
              image: "",
            },
            {
              name: "アジフライスタジアム",
              image: "",
            },
          ],
        },
      ],
    };
  }
  async getShake(): Promise<Shake[]> {
    return [
      {
        period: new Period("2020-12-30T21:00:00", "2021-01-01T09:00:00"),
        stage: {
          name: "朽ちた箱舟 ポラリス",
          image: "",
        },
        weapons: [
          "クアッドホッパーブラック",
          "ヴァリアブルローラー",
          "スパラマニューバー",
          "リッター4K",
        ],
      },
    ];
  }
}
