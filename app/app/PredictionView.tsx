import {
  Chart,
  CreatePredictionForm,
  EvaluatePredictionForm,
  PredictionLabel,
  Price,
} from "@/components";
import { PredictionService } from "@/services/predictionService";
import { HighscoreService } from "@/services/highscoreService";
import { ComponentProps } from "react";
import { ClientType } from "@/clients";

export type PredictionViewProps = ComponentProps<"div"> & {
  predictionService: PredictionService;
  highscoreService: HighscoreService;
  player: string;
  client: ClientType;
};

async function PredictionView({
  predictionService,
  highscoreService,
  player,
  client,
}: PredictionViewProps) {
  const [prediction, highscore, leaderBoard] = await Promise.all([
    predictionService.getPrediction(client, player),
    highscoreService.getHighscore(client, player),
    highscoreService.getRange(client, 0, 10),
  ]);

  return (
    <div className="flex grow w-full flex-row gap-4 justify-center">
      <div className="flex grow flex-col gap-2 max-w-5xl items-center justify-between font-mono text-sm">
        <Chart className="flex flex-col grow" />
        <Price className="pt-2" />
        <EvaluatePredictionForm prediction={prediction} />
        {prediction ? (
          <PredictionLabel prediction={prediction} />
        ) : (
          <CreatePredictionForm />
        )}
        {highscore && (
          <div>
            <p className="text-neutral-200 pt-4">Highscore</p>
            <p className="text-2xl text-neutral-200 text-center">{highscore}</p>
          </div>
        )}
      </div>
      <div>
        <p className="text-neutral-200">Leaderboard</p>
        {leaderBoard.map((x) => (
          <p key={x}>{x}</p>
        ))}
      </div>
    </div>
  );
}

export default PredictionView;
